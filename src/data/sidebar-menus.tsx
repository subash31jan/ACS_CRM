import {
  SquareTerminal,
  Users,
  FileText,
  BarChart,
  Settings2,
  LifeBuoy,
  Send,
  Frame,
  PieChart,
  Map,
  HandCoins,
  ShoppingCart,
} from "lucide-react";

export const sidebarMenus = {
  user: {
    name: "James",
    email: "james@example.com",
    avatar: "/avatars/avatar.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/overview",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard/overview",
        },
        {
          title: "Activity Logs",
          url: "/dashboard/activity-logs",
        },
      ],
    },
    {
      title: "Contacts",
      url: "/dashboard/contacts",
      icon: Users,
      items: [
        {
          title: "All Contacts",
          url: "/dashboard/contacts",
        },
        {
          title: "Segments",
          url: "/dashboard/contacts/segments",
        },
        {
          title: "Import/Export",
          url: "/dashboard/contacts/import-export",
        },
      ],
    },
  ],
  navSecondary: [],
  workspaces: [],
};
