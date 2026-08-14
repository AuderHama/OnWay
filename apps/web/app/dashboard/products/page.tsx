"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Delete, Divide, Edit, LoaderIcon, Plus, Trash } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitMode, setSubmitMode] = useState<"insert" | "edit">("insert");
  const [search, setSearch] = useState("");

  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [storeId, setStoreId] = useState(0);

  const [isAvailable, setIsAvailable] = useState(true);

  const { t } = useTranslation();
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["Products"],
    queryFn: async () => {
      const res = await fetch("/api/v1/products");
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      const json = await res.json();
      return json.products as Array<{
        id: number;
        name: string;
        price: string;
        storeId: number;
        isAvailable: boolean;
      }>;
    },
  });

  const { data: storesData } = useQuery({
    queryKey: ["Stores"],
    queryFn: async () => {
      const res = await fetch("/api/v1/stores");
      if (!res.ok) {
        throw new Error("Failed to fetch stores");
      }
      const json = await res.json();
      return json.stores as Array<{
        id: number;
        name: string;
        city: string;
        isActive: boolean;
      }>;
    },
  });

  const queryClient = useQueryClient();

  const createProduct = useMutation({
    mutationFn: async (body: {
      name: string;
      storeId: number;
      price: number;
      isAvailable: boolean;
    }) => {
      const res = await fetch("/api/v1/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error("Failed to create product!");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Products"] });
      setIsDialogOpen(false);
    },
  });
  const updateProduct = useMutation({
    mutationFn: async (body: {
      id: number;
      name: string;
      storeId: number;
      price: number;
      isAvailable: boolean;
    }) => {
      const req = await fetch(`/api/v1/products/${body.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!req.ok) {
        throw new Error("Failed to update product!");
      }
      return req.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Products"] });
      setIsDialogOpen(false);
    },
  });
  const deleteProduct = useMutation({
    mutationFn: async (id: number) => {
      const req = await fetch(`/api/v1/products/${id}`, {
        method: "DELETE",
      });
      if (!req.ok) {
        throw new Error("Failed to delete product!");
      }
      return req.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Products"] });
    },
  });

  const filteredProducts = (data ?? []).filter((product) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return product.name.toLowerCase().includes(q);
  });
  return (
    <div>
      <h1 className="text-5xl">{t("products.title")}</h1>
      <div className="flex flex-row gap-2">
        <Input
          type="text"
          placeholder={t("products.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          variant="outline"
          onClick={() => {
            setSubmitMode("insert");
            setIsDialogOpen(true);
            setId(0);
            setName("");
            setPrice(0);
            setStoreId(0);
            setIsAvailable(true);
          }}
        >
          {t("products.addProduct")} <Plus />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("products.name")}</TableHead>
            <TableHead>{t("products.price")}</TableHead>
            <TableHead>{t("products.isAvailable")}</TableHead>
            <TableHead>{t("products.storeName")}</TableHead>
            <TableHead className="w-[100]">{t("products.actions")}</TableHead>
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
                <p className="text-red-500">{t("products.fetchFailed")}</p>
              </TableCell>
            </TableRow>
          )}
          {filteredProducts?.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                {t("products.noProducts")}
              </TableCell>
            </TableRow>
          )}
          {filteredProducts?.map((product: any) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>
                {product.isAvailable
                  ? t("products.active")
                  : t("products.inactive")}
              </TableCell>
              <TableCell>{product.storeId}</TableCell>

              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSubmitMode("edit");
                    setIsDialogOpen(true);
                    setId(product.id);
                    setName(product.name);
                    setPrice(product.price);
                    setIsAvailable(product.isAvailable);
                  }}
                >
                  {t("products.edit")} <Edit />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    deleteProduct.mutate(product.id);
                  }}
                >
                  {t("products.delete")} <Trash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (submitMode == "insert") {
                createProduct.mutate({ name, storeId, price, isAvailable });
              } else {
                updateProduct.mutate({ id, name, storeId, price, isAvailable });
              }
            }}
          >
            <DialogHeader>
              <DialogTitle className="text-3xl mb-3">
                {submitMode == "edit"
                  ? t("products.editProduct")
                  : t("products.addProduct")}
              </DialogTitle>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="name-1">{t("products.name")}</Label>
                <Input
                  id="name-1"
                  name="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </Field>
              <Field>
                <Label htmlFor="username-1">{t("products.price")}</Label>
                <Input
                  id="price-1"
                  name="price"
                  value={price}
                  onChange={(e) => {
                    setPrice(Number(e.target.value));
                  }}
                />
              </Field>
              <Field>
                <Label htmlFor="username-1">{t("products.store")}</Label>
                <Select
                  value={storeId}
                  onValueChange={(v) => {
                    setStoreId(Number(v));
                  }}
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("products.stores")}</SelectLabel>
                      {storesData?.map((store: any) => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {/* <Input
                  id="store-1"
                  name="store"
                  value={storeId}
                  onChange={(e) => {
                    setStoreId(Number(e.target.value))
                  }}
                /> */}
              </Field>
              <Field orientation="horizontal">
                <Checkbox
                  id="isAvailable-1"
                  checked={isAvailable}
                  onCheckedChange={(v) => {
                    setIsAvailable(v === true);
                  }}
                />
                <Label htmlFor="isAvailable-1">
                  {t("products.isAvailableLong")}
                </Label>
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose
                render={
                  <Button variant="outline">{t("products.cancel")}</Button>
                }
              />
              <Button type="submit">{t("products.submit")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
