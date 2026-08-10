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
import Link from "next/link";

export function Header() {
  return (
    <Menubar className="">
      <MenubarMenu>
        <MenubarTrigger>
          <Link href="/dashboard/stores">Stores</Link>
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <Link href="/dashboard/products">Producst</Link>
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <Link href="/dashboard/orders">Orders</Link>
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Logout</MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>زمان</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup
          //  value={theme} onValueChange={setTheme}
          >
            <MenubarRadioItem value="kurdish">Kurdish</MenubarRadioItem>
            <MenubarRadioItem value="english">English</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
