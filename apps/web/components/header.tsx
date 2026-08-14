"use client";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export function Header() {
  const { t, i18n } = useTranslation();

  async function handleLogout() {
    await fetch("/api/v1/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    window.location.href = "/dashboard/login";
  }
  return (
    <Menubar className="w-full justify-between">
      <div className="flex gap-2">
        <MenubarMenu>
          <MenubarTrigger>
            <Link href="/dashboard/stores">{t("header.stores")}</Link>
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>
            <Link href="/dashboard/products">{t("header.products")}</Link>
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>
            <Link href="/dashboard/orders">{t("header.orders")}</Link>
          </MenubarTrigger>
        </MenubarMenu>
      </div>

      <div className="flex gap-2">
        <Select
          value={i18n.language}
          onValueChange={(value) => {
            i18n.changeLanguage(value ?? "en");
            localStorage.setItem("language", value ?? "en");
          }}
        >
          <SelectTrigger className="border-none">
            <SelectValue placeholder={t("header.language")}>
              {t("header.language")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="ckb">{t("header.kurdish")}</SelectItem>
              <SelectItem value="en">{t("header.english")}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <MenubarMenu>
          {/* <MenubarTrigger>{t("header.language")}</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup
              value={i18n.language}
              onValueChange={(value) => {
                i18n.changeLanguage(value)
              }}
            >
              <MenubarRadioItem value="ckb">{t("header.kurdish")}</MenubarRadioItem>
              <MenubarRadioItem value="en">{t("header.english")}</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent> */}
          <MenubarMenu>
            <MenubarTrigger>{t("header.logout")}</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={handleLogout}>
                {t("header.logout")}
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </MenubarMenu>
      </div>
    </Menubar>
  );
}
