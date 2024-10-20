import "./style.css";
import "./tailwind.css";

import {
  Home,
  Settings,
  Video,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Video Player - Demo",
    url: "/demo/video",
    icon: Video,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export default function LayoutDashboard({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
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
