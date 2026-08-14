import { Hono } from "hono"
import { stores } from "./routes/stores"
import { orders } from "./routes/orders"
import { products } from "./routes/products"
import { auth } from "./routes/auth"
import { health } from "./routes/health"

export const app = new Hono().basePath("api")

app.route("/v1/auth", auth)
app.route("/v1/stores", stores)
app.route("/v1/orders", orders)
app.route("/v1/products", products)
app.route("/health", health)
