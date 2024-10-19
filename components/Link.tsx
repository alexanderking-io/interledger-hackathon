import clsx from "clsx";
import React from "react";
import { usePageContext } from "vike-react/usePageContext";

export function Link({ href, children, className }: { href: string; children: string, className?: string }) {
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const isActive = href === "/" ? urlPathname === href : urlPathname.startsWith(href);
  return (
    clsx("text-blue-500 hover:underline", className),
    <a href={href} className={clsx(isActive ? "is-active" : undefined, className)}>
      {children}
    </a>
  );
}
