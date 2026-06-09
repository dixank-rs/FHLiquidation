import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import type { ReactNode } from "react";

type PageLayoutProps = {
  activeKey?: string;
  children: ReactNode;
};

export default function PageLayout({ activeKey, children }: PageLayoutProps) {
  return (
    <div
      className="flex min-h-screen flex-col bg-[var(--fhi-body-bg)]"
    >
      <Header activeKey={activeKey} />
      <main
        className="min-w-0 flex-1 bg-[var(--fhi-body-bg)] px-0"
        style={{ paddingTop: "calc(var(--fhi-header-height) + var(--fhi-page-gap))" }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
