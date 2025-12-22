Postgres setup for Server

This project can use Postgres for persistence. The `routes/posts.js` file now performs CRUD against a `posts` table.

1) Install dependencies

```bash
npm install
```

2) Create the `posts` table (use `server/db/schema.sql`):

```bash
# Using psql and DATABASE_URL environment variable
psql "$DATABASE_URL" -f server/db/schema.sql
```

3) Example `.env` values (place in project root or `server/.env`):

```
DATABASE_URL=postgres://user:password@localhost:5432/mydb
PORT=8000
```

4) Run server in dev mode

```bash
npm run dev
```

Notes
- The DB helper is `server/db/index.js` and exports a `query` helper.
- If using managed Postgres, set `DATABASE_URL`. Individual `PG*` vars are also supported.
- `routes/posts.js` returns the same JSON shapes as the former in-memory API.
