"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { LoaderIcon } from "lucide-react";

export default function Home() {
  const [search, setSearch] = useState("");
  const { t } = useTranslation();
  const orderStatuss = [
    "pending",
    "accepted",
    "preparing",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["Orders"],
    queryFn: async () => {
      const res = await fetch("/api/v1/orders");
      if (!res.ok) {
        throw new Error("Failed to fetch stores");
      }
      const json = await res.json();
      return json.orders as Array<{
        id: number;
        customerName: string;
        phone: number;
        address: string;
        storeId: string;
        item: [];
        status: string;
      }>;
    },
  });
  const queryClient = useQueryClient();

  const updateOrder = useMutation({
    mutationFn: async (body: { id: number; status: string }) => {
      const req = await fetch(`/api/v1/orders/${body.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: body.status }),
      });
      if (!req.ok) {
        throw new Error("Failed to update order!");
      }
      return req.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Orders"] });
    },
  });

  const filteredStores = (data ?? []).filter((store) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      store.customerName.toLowerCase().includes(q) ||
      store.address.toLowerCase().includes(q)
    );
  });
  return (
    <div>
      <h1 className="text-5xl">{t("orders.title")}</h1>
      <div className="flex flex-row gap-2">
        <Input
          type="text"
          placeholder={t("orders.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("orders.customerName")}</TableHead>
            <TableHead>{t("orders.phone")}</TableHead>
            <TableHead>{t("orders.address")}</TableHead>
            <TableHead>{t("orders.status")}</TableHead>
            <TableHead>{t("orders.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                <LoaderIcon className="animate-spin" />
              </TableCell>
            </TableRow>
          )}
          {isError && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                <p className="text-red-500">{t("orders.fetchFailed")}</p>
              </TableCell>
            </TableRow>
          )}
          {filteredStores?.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                {t("orders.noStores")}
              </TableCell>
            </TableRow>
          )}
          {filteredStores?.map((orders: any) => (
            <TableRow key={orders.id}>
              <TableCell className="font-medium">
                {orders.customerName}
              </TableCell>
              <TableCell>{orders.phone}</TableCell>
              <TableCell>{orders.address}</TableCell>
              <TableCell>{orders.status}</TableCell>
              <TableCell>
                {orders.status !== "delivered" &&
                  orders.status !== "cancelled" && (
                    <>
                      <Button
                        onClick={() => {
                          updateOrder.mutate({
                            id: orders.id,
                            status:
                              orderStatuss[
                                orderStatuss.findIndex(
                                  (value) => value == orders.status,
                                ) + 1
                              ],
                          });
                        }}
                      >
                        {
                          orderStatuss[
                            orderStatuss.findIndex(
                              (value) => value == orders.status,
                            ) + 1
                          ]
                        }
                      </Button>
                      <Button
                        className={"text-red-500"}
                        onClick={() => {
                          updateOrder.mutate({
                            id: orders.id,
                            status: "cancelled",
                          });
                        }}
                      >
                        {t("orders.cancel")}
                      </Button>
                    </>
                  )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
