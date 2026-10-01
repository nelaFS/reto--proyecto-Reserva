# Reservadb Backend

API REST para autenticacion del administrador y gestion de reservas.

## Requisitos

- Node.js 20 o superior.
- PostgreSQL 15 o superior.
- La base `reservadb` creada con los scripts de `../db/`.

## Instalacion

```bash
npm install
copy .env.example .env
```

Completa `DATABASE_URL`, `DATABASE_SSL` y un `JWT_SECRET` de al menos 32
caracteres en `.env`.

`CORS_ORIGIN` acepta varios origenes separados por comas. En desarrollo debe
incluir el origen de Astro, normalmente `http://localhost:4321`.

## Ejecucion

```bash
npm run dev
```

La API queda disponible en `http://localhost:3000`.

Comprobacion de salud:

```bash
curl http://localhost:3000/health
```

## Scripts

- `npm run dev`: servidor local con Hono.
- `npm run typecheck`: comprobacion estricta de TypeScript.
- `npm test`: pruebas automatizadas.
- `npm run build`: validacion de compilacion sin emitir archivos.

## API

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/reservas`
- `PATCH /api/reservas/:id`
- `GET /api/reservas`
- `GET /api/reservas?estado=Disponible&page=1&limit=20`
- `GET /api/public/mesas/disponibles?fechaReserva=2026-10-01%2019:00:00&cantidadPersonas=2`
- `POST /api/public/reservas`
- `GET /api/public/menu`
- `GET /api/public/eventos`
- `GET /api/public/promociones`

Los filtros adicionales son `fechaDesde`, `fechaHasta`, `numeroMesa` y
`nombreCliente`. Las fechas se manejan como hora local del restaurante con el
formato `YYYY-MM-DD HH:mm:ss`.

Las rutas de reservas y logout requieren:

```text
Authorization: Bearer <token>
```

## Base de datos

Ejecuta primero `../db/0.CreacionDeBase.sql` conectado a la base administrativa
`postgres`. Después, conectado a `reservadb`, ejecuta:

1. `../db/1.CreacionDeTablas.sql`
2. `../db/4.MigracionNuevoModelo.sql`
3. `../db/2.Restricciones.sql`
4. `../db/3.InsercionDeDatos.sql`

El administrador de ejemplo usa el usuario `sabinofc`. Su contrasena se
almacena como hash bcrypt con costo 8; la contrasena de desarrollo es
`123456`.

## Vercel

El entrypoint `src/index.ts` exporta la aplicacion Hono como `default`, por lo
que Vercel puede desplegarla como una Function de Node.js. Configura las
variables de `.env.example` en el ambiente correspondiente de Vercel.
