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
  Building2,
  List,
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
          title: "Import/Export",
          url: "/dashboard/customers/import-export",
        },
      ],
    },
    {
      title: "Companies",
      url: "/dashboard/companies",
      icon: Building2,
      items: [
        {
          title: "All Companies",
          url: "/dashboard/companies",
        },
        {
          title: "Import/Export",
          url: "/dashboard/companies/import-export",
        },
      ],
    },
    {
      title: "Lists",
      url: "/dashboard/lists",
      icon: List,
      items: [
        {
          title: "All Lists",
          url: "/dashboard/lists",
        },
        {
          title: "Import/Export",
          url: "/dashboard/lists/import-export",
        },
      ],
    },
    // {
    //   title: "Orders",
    //   url: "/dashboard/orders",
    //   icon: ShoppingCart,
    //   items: [
    //     {
    //       title: "All Orders",
    //       url: "/dashboard/orders",
    //     },
    //     {
    //       title: "Pending Orders",
    //       url: "/dashboard/orders/pending",
    //     },
    //     {
    //       title: "Completed Orders",
    //       url: "/dashboard/orders/completed",
    //     },
    //   ],
    // },

    // {
    //   title: "Invoices",
    //   url: "/dashboard/invoices",
    //   icon: FileText,
    //   items: [
    //     {
    //       title: "All Invoices",
    //       url: "/dashboard/invoices",
    //     },
    //     {
    //       title: "Pending",
    //       url: "/dashboard/invoices/pending",
    //     },
    //     {
    //       title: "Paid",
    //       url: "/dashboard/invoices/paid",
    //     },
    //   ],
    // },
    // {
    //   title: "Reports",
    //   url: "/dashboard/reports/sales",
    //   icon: BarChart,
    //   items: [
    //     {
    //       title: "Sales Report",
    //       url: "/dashboard/reports/sales",
    //     },
    //     {
    //       title: "Customer Insights",
    //       url: "/dashboard/reports/customer-insights",
    //     },
    //     {
    //       title: "Revenue",
    //       url: "/dashboard/reports/revenue",
    //     },
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "/dashboard/settings/general",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "/dashboard/settings/general",
    //     },
    //     {
    //       title: "Users & Permissions",
    //       url: "/dashboard/settings/users",
    //     },
    //     {
    //       title: "Integrations",
    //       url: "/dashboard/settings/integrations",
    //     },
    //     {
    //       title: "API Settings",
    //       url: "/dashboard/settings/api",
    //     },
    //   ],
    // },
  ],
  navSecondary: [],
  workspaces: [],
};
