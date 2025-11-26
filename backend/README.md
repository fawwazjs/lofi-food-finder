Quick backend for Lofi Food Finder

Setup

1. Install dependencies

```bash
cd backend
npm install
```

2. Configure environment

Copy `.env.example` to `.env` and set `MONGO_URI` if needed.

3. Run

```bash
npm run dev
```

Docker (optional)

If you don't have a local MongoDB running, you can start one with Docker Compose:

```bash
cd backend
docker compose up -d
```

This will expose MongoDB at `mongodb://127.0.0.1:27017` and create the `lofi_food_finder` database.

Then run the server as before (`npm run dev`).

API

- `GET /api/health` - health check
- `GET /api/areas` - list areas
- `POST /api/areas` - create area
- `GET /api/places` - list places (query `?area=<areaId>`)
- `GET /api/places/:id` - get place
- `POST /api/places` - create place
 - `POST /api/auth/register` - register user (body: `name`, `email`, `password`)
 - `POST /api/auth/login` - login user (body: `email`, `password`) — returns `token`
