# taller-copilot

## Backend FastAPI con JWT

Este repositorio incluye una aplicación Web API en `/backend` construida con **Python**, **FastAPI** y **Poetry**. La API implementa autenticación con **JWT**, incluyendo login y refresh de token.

### Características

- Login con credenciales fijas:
  - usuario: `admin`
  - password: `admin123`
- Access token JWT con expiración de **300 segundos**
- Endpoint para refrescar el access token
- Hashing de contraseñas con `passlib[bcrypt]`
- Dependencia `bcrypt` fijada a `>=3.2,<4.0`
- Despliegue con `Dockerfile` y `docker-compose.yml`
- Gestión de dependencias con **Poetry**

## Estructura

```text
.
├── backend/
│   ├── app/
│   │   └── main.py
│   ├── Dockerfile
│   ├── poetry.lock
│   └── pyproject.toml
└── docker-compose.yml
```

## Requisitos

- Python 3.12+
- Poetry
- Docker y Docker Compose (opcional)

## Ejecutar localmente con Poetry

```bash
cd /tmp/workspace/lpbaufest/taller-copilot/backend
export JWT_SECRET_KEY="cambia-esta-clave"
export ADMIN_USERNAME="admin"
export ADMIN_PASSWORD="admin123"
poetry install
poetry run uvicorn app.main:app --reload
```

La API queda disponible en:

- `http://127.0.0.1:8000`
- documentación Swagger: `http://127.0.0.1:8000/docs`

## Ejecutar con Docker Compose

```bash
cd /tmp/workspace/lpbaufest/taller-copilot
export JWT_SECRET_KEY="cambia-esta-clave"
docker compose up --build
```

## Endpoints

### `POST /token`

Genera un access token y un refresh token.

#### Request

```json
{
  "username": "admin",
  "password": "admin123"
}
```

#### Ejemplo con curl

```bash
curl -X POST http://127.0.0.1:8000/token \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

#### Response

```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>",
  "token_type": "bearer",
  "expires_in": 300
}
```

### `POST /token/refresh`

Recibe un refresh token válido y devuelve un nuevo access token.

#### Request

```json
{
  "refresh_token": "<jwt>"
}
```

#### Ejemplo con curl

```bash
curl -X POST http://127.0.0.1:8000/token/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token":"<jwt>"}'
```

#### Response

```json
{
  "access_token": "<jwt>",
  "token_type": "bearer",
  "expires_in": 300
}
```

## Variables de entorno

- `JWT_SECRET_KEY`: clave utilizada para firmar los tokens JWT.
- `ADMIN_USERNAME`: usuario permitido para el login. Para este caso de uso usar `admin`.
- `ADMIN_PASSWORD`: contraseña permitida para el login. Para este caso de uso usar `admin123`.

> Nota: `JWT_SECRET_KEY` es obligatoria. En producción debe configurarse un secreto robusto y no reutilizado.