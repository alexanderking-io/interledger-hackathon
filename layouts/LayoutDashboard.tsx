import "./style.css";
import "./tailwind.css";

import {
  DollarSign,
  Settings,
  Users2,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Users",
    url: "#",
    icon: Users2,
  },
  {
    title: "Billing",
    url: "#",
    icon: DollarSign,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export default function LayoutDashboard({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="min-h-screen w-full">
        <SidebarTrigger className="m-2" />
        <div className="w-full">
          <div>
            <Separator orientation="horizontal" />
          </div>
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
