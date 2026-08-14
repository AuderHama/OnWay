"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import Link from "next/link";
export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      <div>
        <h1 className="text-5xl mb-5">OnWay</h1>
      </div>
      <div className="flex mb-2  gap-2">
        <Link href="/dashboard/stores" className="mx-auto w-full min-w-3.5">
          <Card className="mx-auto w-full min-w-3.5">
            <CardContent>
              <CardTitle>{t("stores.title")}</CardTitle>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/products" className="mx-auto w-full min-w-3.5">
          <Card className="mx-auto w-full min-w-3.5">
            <CardContent>
              <CardTitle>{t("products.title")}</CardTitle>
            </CardContent>
          </Card>
        </Link>
      </div>
      <Link href="/dashboard/orders">
        <Card size="default" className="mx-auto w-full min-w-2xl">
          <CardContent>
            <CardTitle>{t("orders.title")}</CardTitle>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
