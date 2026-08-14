import { jwt } from "hono/jwt"

export const requireAuth = jwt({
  secret: process.env.JWT_SECRET!,
  alg: "HS256",
  cookie: "token",
})
