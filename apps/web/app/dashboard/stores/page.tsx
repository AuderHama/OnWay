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
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Delete,
  Divide,
  Edit,
  ExternalLink,
  LoaderIcon,
  Plus,
  Trash,
} from "lucide-react";
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
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import Link from "next/link";

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitMode, setSubmitMode] = useState<"insert" | "edit">("insert");
  const [search, setSearch] = useState("");

  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [isActive, setIsActive] = useState(true);

  const { t } = useTranslation();
  const { data, isPending, isError, error, refetch } = useQuery({
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

  const createStore = useMutation({
    mutationFn: async (body: {
      name: string;
      city: string;
      isActive: boolean;
    }) => {
      const res = await fetch("/api/v1/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error("Failed to create store!");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Stores"] });
      setIsDialogOpen(false);
    },
  });
  const updateStore = useMutation({
    mutationFn: async (body: {
      id: number;
      name: string;
      city: string;
      isActive: boolean;
    }) => {
      const req = await fetch(`/api/v1/stores/${body.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!req.ok) {
        throw new Error("Failed to update store!");
      }
      return req.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Stores"] });
      setIsDialogOpen(false);
    },
  });
  const deleteStore = useMutation({
    mutationFn: async (id: number) => {
      const req = await fetch(`/api/v1/stores/${id}`, {
        method: "DELETE",
        // headers: { "Content-Type": "application/json" },
        // body: JSON.stringify(body),
      });
      if (!req.ok) {
        throw new Error("Failed to delete store!");
      }
      return req.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Stores"] });
    },
  });

  const filteredStores = (data ?? []).filter((store) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      store.name.toLowerCase().includes(q) ||
      store.city.toLowerCase().includes(q)
    );
  });
  return (
    <div>
      <h1 className="text-5xl">{t("stores.title")}</h1>
      <div className="flex flex-row gap-2">
        <Input
          type="text"
          placeholder={t("stores.search")}
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
            setCity("");
            setIsActive(true);
          }}
        >
          {t("stores.addStore")} <Plus />
        </Button>
      </div>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>{t("stores.name")}</TableHead>
            <TableHead>{t("stores.city")}</TableHead>
            <TableHead>{t("stores.isActive")}</TableHead>
            <TableHead className="w-[100]">{t("stores.actions")}</TableHead>
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
                <p className="text-red-500">{t("stores.fetchFailed")}</p>
              </TableCell>
            </TableRow>
          )}
          {filteredStores?.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                {t("stores.noStores")}
              </TableCell>
            </TableRow>
          )}
          {filteredStores?.map((store: any) => (
            <TableRow key={store.id}>
              <TableCell className="font-medium">{store.name}</TableCell>
              <TableCell>{store.city}</TableCell>
              <TableCell>
                {store.isActive ? t("stores.active") : t("stores.inactive")}
              </TableCell>
              <TableCell>
                <Link
                  href={`/dashboard/stores/${store.id}/products`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  {t("stores.enter")} <ExternalLink className="size-3.5" />
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSubmitMode("edit");
                    setIsDialogOpen(true);
                    setId(store.id);
                    setName(store.name);
                    setCity(store.city);
                    setIsActive(store.isActive);
                  }}
                >
                  {t("stores.edit")} <Edit />
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    deleteStore.mutate(store.id);
                  }}
                >
                  {t("stores.delete")} <Trash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <form
            // onSubmit={() => {
            //   createStore.mutate({ name, city, isActive })
            // }}
            onSubmit={(e) => {
              e.preventDefault();
              if (submitMode == "insert") {
                createStore.mutate({ name, city, isActive });
              } else {
                updateStore.mutate({ id, name, city, isActive });
              }
            }}
          >
            <DialogHeader>
              <DialogTitle className="text-3xl mb-3">
                {submitMode == "edit"
                  ? t("stores.editStore")
                  : t("stores.addStore")}
              </DialogTitle>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="name-1">{t("stores.name")}</Label>
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
                <Label htmlFor="username-1">{t("stores.city")}</Label>
                <Input
                  id="city-1"
                  name="city"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                  }}
                />
              </Field>
              <Field orientation="horizontal">
                <Checkbox
                  id="isActive-1"
                  checked={isActive}
                  onCheckedChange={(v) => {
                    setIsActive(v === true);
                  }}
                />
                <Label htmlFor="isActive-1">{t("stores.isActiveLong")}</Label>
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose
                render={<Button variant="outline">{t("stores.cancel")}</Button>}
              />
              <Button type="submit">{t("stores.submit")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
