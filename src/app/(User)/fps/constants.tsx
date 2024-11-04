import { HomeIcon, Clipboard, FileText, Users, HelpCircle } from "lucide-react";
import { SideNavItem } from "@/types/types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "FPS Dashboard",
    path: "/fps/dashboard",
    icon: <HomeIcon width="24" height="24" />,
  },
  {
    title: "View Inventory",
    path: "/fps/view-inventory",
    icon: <Clipboard width="24" height="24" />,
  },
  {
    title: "Distribute Stock",
    path: "/fps/distribute-stock",
    icon: <FileText width="24" height="24" />,
  },
  {
    title: "Help",
    path: "/fps/help",
    icon: <HelpCircle width="24" height="24" />,
  },
];
