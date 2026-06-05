# FlowOps – Frontend

Aplicación web React que consume la API JWT del backend para autenticación con login y panel de bienvenida protegido.

## Tecnologías

- **React 19** (con Vite como bundler)
- **React Router v7** para navegación y rutas protegidas
- **SessionStorage** para almacenamiento seguro del token JWT

## Diseño

La interfaz sigue el sistema de diseño **FlowOps – Surgical Precision** definido en [`DESIGN.md`](../DESIGN.md):

- Fuente: **Inter** (Google Fonts)
- Paleta: primario `#111827`, superficie `#E5E7EB`, texto `#6B7280`
- Radios de borde: `0px`, `4px`, `32px`, `9999px`
- Tratamiento de superficies tipo **Glass** con `backdrop-filter: blur`
- Botones primary: fondo `#111827`, borde `9999px`

## Estructura del proyecto

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   └── PrivateRoute.jsx   # Guarda de ruta autenticada
│   ├── context/
│   │   └── AuthContext.jsx    # Contexto de autenticación (sessionStorage)
│   ├── pages/
│   │   ├── Login.jsx          # Página de inicio de sesión
│   │   └── Welcome.jsx        # Página de bienvenida (protegida)
│   ├── App.jsx                # Configuración de rutas
│   ├── index.css              # Tokens de diseño globales
│   └── main.jsx               # Entry point
├── index.html
├── package.json
└── vite.config.js             # Proxy hacia el backend en /api
```

## Requisitos

- Node.js 18+ y npm

## Instalación y ejecución local

### 1. Instalar dependencias

```bash
cd frontend
npm install
```

### 2. Levantar el backend primero

El frontend necesita la API backend corriendo. Por defecto hace proxy a `http://localhost:8000`.

```bash
# En la raíz del proyecto:
cd backend
export JWT_SECRET_KEY="cambia-esta-clave"
export ADMIN_USERNAME="admin"
export ADMIN_PASSWORD="admin123"
poetry install
poetry run uvicorn app.main:app --reload
```

### 3. Iniciar el servidor de desarrollo

```bash
cd frontend
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

## Variables de entorno (opcional)

Si el backend está en una URL diferente, crea un archivo `.env.local` en la carpeta `frontend/`:

```env
VITE_API_URL=http://localhost:8000
```

Sin esta variable, el frontend usa el proxy `/api` configurado en `vite.config.js` que apunta a `http://localhost:8000`.

## Ejecución con Docker Compose

Desde la raíz del proyecto, con ambos servicios (backend + frontend):

```bash
cp .env.example .env   # Ajusta las variables de entorno si es necesario
docker compose up --build
```

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`

## Uso

1. Accede a `http://localhost:5173` – serás redirigido a la página de **Login**.
2. Ingresa las credenciales (por defecto: usuario `admin`, contraseña `admin123`).
3. Al autenticarte correctamente eres redirigido a la página de **Bienvenida**.
4. La página de Bienvenida es accesible **únicamente** con sesión activa.
5. Haz clic en **Cerrar sesión** para terminar la sesión y volver al Login.

## Páginas

### `/login` – Inicio de sesión

- Formulario con campos de usuario y contraseña.
- Llama a `POST /token` en el backend.
- Guarda `access_token` y `refresh_token` en `sessionStorage`.
- Redirige a `/welcome` tras autenticación exitosa.
- Muestra mensaje de error si las credenciales son incorrectas.

### `/welcome` – Panel de bienvenida (protegido)

- Solo accesible con sesión activa.
- Muestra el nombre de usuario decodificado del JWT.
- Incluye panel con información de la sesión.
- Botón de cierre de sesión que limpia `sessionStorage` y redirige a `/login`.

## Build para producción

```bash
cd frontend
npm run build
```

Los archivos compilados quedan en `frontend/dist/`.

## Lint

```bash
cd frontend
npm run lint
```
