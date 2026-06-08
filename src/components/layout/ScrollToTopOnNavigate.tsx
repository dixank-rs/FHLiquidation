"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Reset scroll position on client-side route changes for smoother page transitions. */
export default function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
