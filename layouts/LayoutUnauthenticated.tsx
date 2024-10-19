import "./style.css";
import "./tailwind.css";

export default function UnauthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex m-auto">
      <Content>{children}</Content>
    </div>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div id="page-container">
      <div id="page-content" className="p-5 pb-12 min-h-screen flex justify-center items-center">
        {children}
      </div>
    </div>
  );
}
