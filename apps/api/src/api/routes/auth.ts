import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { sign } from "hono/jwt";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "../../db";
import { users } from "../../db/schema";
import { setCookie, deleteCookie } from "hono/cookie";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const auth = new Hono();

auth.post("/login", zValidator("json", loginSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user || user.deletedAt) {
    return c.json({ success: false, message: "Invalid credentials" }, 401);
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return c.json({ success: false, message: "Invalid credentials" }, 401);
  }

  const token = await sign(
    {
      sub: String(user.id),
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    },
    process.env.JWT_SECRET!,
  );
  setCookie(c, "token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return c.json(
    {
      success: true,
      data: { user: { id: user.id, email: user.email } },
    },
    200,
  );
});

auth.post("/logout", (c) => {
  deleteCookie(c, "token");
  return c.json({ success: true, message: "logged in successfully." }, 200);
});
