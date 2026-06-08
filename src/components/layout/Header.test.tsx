import Header from "@/components/layout/Header";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/auction"),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ priority: _priority, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => {
    return <img {...props} alt={props.alt ?? ""} />;
  },
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("Header responsive navigation", () => {
  it("exposes a mobile menu toggle with 44px touch target", () => {
    render(<Header />);

    const toggle = screen.getByRole("button", { name: "Toggle navigation" });
    expect(toggle).toHaveClass("h-10", "w-10");
  });

  it("opens mobile accordion links for inventory items", async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByRole("button", { name: "Toggle navigation" }));

    const inventoryTriggers = screen.getAllByRole("button", { name: /^Inventory$/i });
    const mobileTrigger = inventoryTriggers.find((button) => button.className.includes("lg:hidden"));
    expect(mobileTrigger).toBeDefined();

    await user.click(mobileTrigger!);

    expect(screen.getByRole("link", { name: /Import Manifest/i })).toHaveAttribute("href", "/import-manifest");
    expect(screen.getByRole("link", { name: /Receive Inventory/i })).toHaveAttribute("href", "/receive-inventory");
  });

  it("renders desktop dropdown links when opened", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const reportsTrigger = document.getElementById("nav-reports-trigger");
    expect(reportsTrigger).not.toBeNull();

    await user.click(reportsTrigger!);

    const menu = document.getElementById("nav-reports-menu");
    expect(menu).not.toBeNull();

    expect(within(menu as HTMLElement).getByRole("menuitem", { name: /Manifest Reports/i })).toHaveAttribute(
      "href",
      "/manifest-reports",
    );
  });
});
