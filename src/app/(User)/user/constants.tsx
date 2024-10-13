import {
  HomeIcon,
  User,
  Bell,
  HelpCircle,
  Calendar,
  Clipboard,
  Edit,
  CheckSquare,
} from "lucide-react";
import { SideNavItem } from "@/types/types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Home",
    path: "/user/dashboard",
    icon: <HomeIcon width="24" height="24" />,
  },
  {
    title: "Add Member",
    path: "/user/add-member",
    icon: <User width="24" height="24" />,
  },
  {
    title: "Update Details",
    path: "/user/update-details",
    icon: <Edit width="24" height="24" />,
  },
  {
    title: "Check Stock",
    path: "/user/check-stock",
    icon: <Clipboard width="24" height="24" />,
  },
  {
    title: "Allocated",
    path: "/user/allocated",
    icon: <CheckSquare width="24" height="24" />,
  },
  {
    title: "Help",
    path: "/user/help",
    icon: <HelpCircle width="24" height="24" />,
  },
];
