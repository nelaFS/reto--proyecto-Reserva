# Reservadb Frontend

Frontend estatico construido con Astro, Tailwind CSS 4 y TypeScript para
consumir la API de `../backend`.

## Requisitos

- Node.js 20 o superior.
- El backend disponible en la URL configurada en `PUBLIC_API_URL` cuando se
  realicen pruebas de integracion.

## Instalacion

```bash
npm install
copy .env.example .env
```

Configura `PUBLIC_API_URL`. La variable es publica porque se utiliza desde el
navegador; no coloques secretos en ella.

## Verificacion

Estos comandos no levantan ningun servidor:

```bash
npm run check
npm test
npm run build
```

## Rutas

- `/`: landing publica de Sabino / Cena.
- `/login`: autenticacion del administrador.
- `/reservas`: panel protegido para administrar reservas.

## Sesion

El token JWT se guarda en `localStorage` con la clave
`reservadb.accessToken`. La aplicacion elimina la sesion cuando el backend
responde `401` o cuando el administrador cierra sesion.

El guard del cliente mejora la experiencia, pero la seguridad real depende del
middleware JWT del backend.

## Backend esperado

El cliente consume:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/reservas`
- `PATCH /api/reservas/:id`
- `GET /api/reservas`

Los filtros de la pantalla incluyen estado, cliente, mesa, fecha inicial y
fecha final. Las fechas se envian como limites locales del dia para evitar
desplazamientos de zona horaria.

Los cuerpos y respuestas siguen el contrato documentado en el backend. El
backend debe configurar `CORS_ORIGIN` con el dominio donde se publique este
frontend.

## Vercel

Astro genera una salida estatica por defecto. No se utiliza el adaptador de
Vercel ni SSR. Vercel puede detectar el proyecto y publicar `dist/` con la
configuracion estandar de Astro.
