import "./style.css";
import "./tailwind.css";

import logoUrl from "../assets/logo.svg";
import { Link } from "../components/Link.js";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  return (

    <SidebarProvider>
    <AppSidebar />
    <main>
      <div className="flex max-w-5xl m-auto">
        <SidebarTrigger />
      </div>
      {/* <Link href="/">Welcome</Link>
        <Link href="/todo">Todo</Link>
        <Link href="/star-wars">Data Fetching</Link>
    <div className="flex max-w-5xl m-auto">
      <Sidebar>
        <Logo />
        <Link href="/">Welcome</Link>
        <Link href="/video-demo">Video Demo</Link>
        <Link href="/account">Account</Link> */}
        <div className="flex max-w-5xl m-auto">
          {children}
        </div>

    </main>
  </SidebarProvider>
    // <div className="flex max-w-5xl m-auto">
    //   <Sidebar>
    //     <Logo />

    //     {""}
    //   </Sidebar>
    //   <Content>{children}</Content>
    // </div>
  );
}

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div id="sidebar" className="p-5 flex flex-col shrink-0 border-r-2 border-r-gray-200">
      {children}
    </div>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div id="page-container">
      <div id="page-content" className=" min-h-screen">
        {children}
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="p-5 mb-2">
      <a href="/">
        <img src={logoUrl} height={64} width={64} alt="logo" />
      </a>
    </div>
  );
}
