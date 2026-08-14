"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  async function handleLogin(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    if (res.ok) {
      window.location.href = "/dashboard/stores";
    }
  }

  return (
    <div className="flex justify-center items-center w-full flex-1">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("login.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6 mb-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{t("login.email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t("login.password")}</Label>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
            </div>
            <Button type="submit" className="w-full">
              {t("login.login")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
