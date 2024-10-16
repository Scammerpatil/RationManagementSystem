import {
  HomeIcon,
  HelpCircle,
  Clipboard,
  CheckSquare,
  FileCheck,
} from "lucide-react";
import { SideNavItem } from "@/types/types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Tehsil Dashboard",
    path: "/tehsil/dashboard",
    icon: <HomeIcon width="24" height="24" />,
  },
  {
    title: "Approve Ration Card Request",
    path: "/tehsil/approve-ration-card",
    icon: <CheckSquare width="24" height="24" />,
  },
  {
    title: "Approve FPS Request",
    path: "/tehsil/approve-fps",
    icon: <Clipboard width="24" height="24" />,
  },
  {
    title: "Distribute Stock to FPS",
    path: "/tehsil/distribute-stock",
    icon: <FileCheck width="24" height="24" />,
  },
  {
    title: "Help",
    path: "/tehsil/help",
    icon: <HelpCircle width="24" height="24" />,
  },
];
