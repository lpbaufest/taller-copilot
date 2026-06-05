import os
from datetime import datetime, timedelta, timezone
from uuid import uuid4

from fastapi import FastAPI, HTTPException, status
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import AliasChoices, BaseModel, Field


ACCESS_TOKEN_EXPIRE_SECONDS = 300
REFRESH_TOKEN_EXPIRE_SECONDS = 3600
ALGORITHM = "HS256"
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

if not SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY debe estar definida")

if not ADMIN_USERNAME or not ADMIN_PASSWORD:
    raise RuntimeError("ADMIN_USERNAME y ADMIN_PASSWORD deben estar definidos")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


fake_user_db = {
    ADMIN_USERNAME: {
        "username": ADMIN_USERNAME,
        "hashed_password": get_password_hash(ADMIN_PASSWORD),
    }
}


class LoginRequest(BaseModel):
    username: str = Field(validation_alias=AliasChoices("username", "usuario"))
    password: str


class TokenRefreshRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = ACCESS_TOKEN_EXPIRE_SECONDS


class AccessTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = ACCESS_TOKEN_EXPIRE_SECONDS


def create_token(subject: str, token_type: str, expires_in: int) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=expires_in)
    payload = {
        "sub": subject,
        "type": token_type,
        "exp": expires_at,
        "jti": str(uuid4()),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def authenticate_user(username: str, password: str) -> bool:
    user = fake_user_db.get(username)
    if user is None:
        return False
    return verify_password(password, user["hashed_password"])


def decode_token(token: str) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido o expirado",
    )
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError as exc:
        raise credentials_exception from exc


app = FastAPI(title="JWT Demo API", version="1.0.0")


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "JWT Demo API funcionando"}


@app.post("/token", response_model=TokenResponse)
def login(payload: LoginRequest) -> TokenResponse:
    if not authenticate_user(payload.username, payload.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
        )

    access_token = create_token(
        subject=payload.username,
        token_type="access",
        expires_in=ACCESS_TOKEN_EXPIRE_SECONDS,
    )
    refresh_token = create_token(
        subject=payload.username,
        token_type="refresh",
        expires_in=REFRESH_TOKEN_EXPIRE_SECONDS,
    )
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@app.post("/token/refresh", response_model=AccessTokenResponse)
def refresh_token(payload: TokenRefreshRequest) -> AccessTokenResponse:
    token_payload = decode_token(payload.refresh_token)
    if token_payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="El token enviado no es un refresh token válido",
        )

    username = token_payload.get("sub")
    if username not in fake_user_db:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario inválido",
        )

    access_token = create_token(
        subject=username,
        token_type="access",
        expires_in=ACCESS_TOKEN_EXPIRE_SECONDS,
    )
    return AccessTokenResponse(access_token=access_token)
