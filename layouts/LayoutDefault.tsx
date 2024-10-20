import "./style.css";
import "./tailwind.css";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <div className="flex max-w-5xl m-auto">
          <SidebarTrigger />
        </div>
        <div className="flex max-w-5xl m-auto">{children}</div>
      </main>
    </SidebarProvider>
  );
}
