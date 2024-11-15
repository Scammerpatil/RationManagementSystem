import {
  HomeIcon,
  Users,
  Truck,
  PlusCircle,
  Package,
  HelpCircle,
  Clipboard,
} from "lucide-react";
import { SideNavItem } from "@/types/types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Admin Dashboard",
    path: "/admin/dashboard",
    icon: <HomeIcon width="24" height="24" />,
  },
  {
    title: "Manage Tehsils",
    path: "/admin/manage-tehsils",
    icon: <Clipboard width="24" height="24" />,
  },
  {
    title: "Allocate Stock",
    path: "/admin/allocate-stock",
    icon: <Truck width="24" height="24" />,
  },
  {
    title: "View Stock",
    path: "/admin/view-stock",
    icon: <Package width="24" height="24" />,
  },
  {
    title: "Help",
    path: "/admin/help",
    icon: <HelpCircle width="24" height="24" />,
  },
];
