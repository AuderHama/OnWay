## OnWay

This Project is built as a Bun monorepo with a Next.js dashboard and a Hono API. with nextjs its a multi-language delivery admin panel demo so the admins can monitor and manage the current and the history of stores, products and orders also be able to modify or create new items in each list

### Tools used in the project

- nextjs
  - app router
  - middleware
- typescript
  - type safety
- Hono:
  - creating apis
  - jwt
  - validations
  - creating cookies
- bun
  - package manager
  - monorepo
  - creating apis
- zod
  - validation
  - data safety and structure
- bcryptjs
  - hashing password
- drizzle
  - communicating with the database
- postgreSql
  - database
- tanstack query
  - fetching from apis
- i18next
  - for multiple language support (English, and Kurdish in this case)
  - rtl support
- tailwind
  - styling
- shadcn
  - ui components
  - direction (making the components to change direction with language chnage not just the direction of the page)

## Steps to run the project locally

```bash
git clone https://github.com/AuderHama/OnWay
cd OnWay
bun install

# create apps/api/.env with DATABASE_URL, JWT_SECRET, PORT=3001

bun run --filter @on-way/api db:migrate
bun run --filter @on-way/api db:seed

bun run dev:api   # http://localhost:3001
bun run dev:web   # http://localhost:3000
```

### Live AWS URL

http://63.178.12.226/

### Login

#### email

```bash
admin@example.com
```

#### password

```bash
admin123
```

### env variable lists

```bash
 DATABASE_URL
 JWT_SECRET
 PORT
```

### API examples

1. Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d "{\"email\":\"admin@example.com\",\"password\":\"admin123\"}"
```

2. Create order

```bash
curl -X POST http://localhost:3001/api/v1/orders \
  -H "Content-Type: application/json" \
  -d "{\"customerName\":\"Ahmad\",\"phone\":\"0750000000\",\"address\":\"Ranya\",\"storeId\":1,\"item\":[{\"productId\":1,\"qty\":2},{\"productId\":2,\"qty\":1}]}"
```

3. Update order status

```bash
curl -X PATCH http://localhost:3001/api/v1/orders/1/status \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d "{\"status\":\"accepted\"}"
```

#### What I would improve about this project if i had more time?

- live reload for orders
- more error handling
- toasts to show the performed actions
- more mature dashboard so the admin will have an idea of things without opening the pages
- dialog to show order details
- more consistent and nicer design

#### Time spent:

15 - 20 hours if you count the search
