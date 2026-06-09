"use client";

import { IconChevronDown, IconClose, IconMenu } from "@/components/common/icons";
import AppContainer from "@/components/layout/AppContainer";
import { fontFamilyHeading } from "@/config/fonts";
import { assetPath } from "@/config/site";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

type NavLinkItem = {
  key: string;
  label: string;
  href: string;
};

type NavDropdownItem = NavLinkItem & {
  /** Short line shown under the label in the dropdown panel */
  description?: string;
};

type NavDropdownGroup = {
  type: "dropdown";
  key: string;
  title: string;
  items: NavDropdownItem[];
  /** Align dropdown panel to the right edge of the trigger (for rightmost menus). */
  menuAlignEnd?: boolean;
};

type NavLinkEntry = {
  type: "link";
  key: string;
  label: string;
  href: string;
};

type NavEntry = NavLinkEntry | NavDropdownGroup;

type HeaderProps = {
  navEntries?: NavEntry[];
  activeKey?: string;
};

const defaultNavEntries: NavEntry[] = [
  { type: "link", key: "dashboard", label: "Dashboard", href: "/auction" },
  {
    type: "dropdown",
    key: "auctions",
    title: "Auctions",
    items: [
      {
        key: "new-auction",
        label: "New Auction",
        href: "/auction/new",
        description: "Create a new auction",
      },
      {
        key: "conditions",
        label: "Conditions",
        href: "/conditions",
        description: "Manage item conditions",
      },
    ],
  },
  {
    type: "dropdown",
    key: "inventory",
    title: "Inventory",
    items: [
      {
        key: "purchase-codes",
        label: "Purchase Codes",
        href: "/purchase-codes",
        description: "Manage purchase codes",
      },
      {
        key: "import-manifest",
        label: "Import Manifest",
        href: "/import-manifest",
        description: "Import vendor manifest files",
      },
      {
        key: "receive-inventory",
        label: "Receive Inventory",
        href: "/receive-inventory",
        description: "Receive incoming inventory",
      },
      {
        key: "export-inventory",
        label: "Export Inventory",
        href: "/export-inventory",
        description: "Export inventory data",
      },
    ],
  },
  {
    type: "dropdown",
    key: "administration",
    title: "Administration",
    items: [
      {
        key: "users",
        label: "Users",
        href: "/users",
        description: "Manage user accounts",
      },
      {
        key: "roles",
        label: "Roles",
        href: "/roles",
        description: "Manage user roles",
      },
      {
        key: "permissions",
        label: "Permissions",
        href: "/permissions",
        description: "Manage permissions",
      },
      {
        key: "conditions",
        label: "Conditions",
        href: "/conditions",
        description: "Manage item conditions",
      },
    ],
  },
  {
    type: "dropdown",
    key: "reports",
    title: "Reports",
    items: [
      {
        key: "manifest-reports",
        label: "Manifest Reports",
        href: "/manifest-reports",
        description: "View manifest reports",
      },
      {
        key: "reprint-labels",
        label: "Reprint Labels",
        href: "/reprint-labels",
        description: "Reprint item labels",
      },
    ],
  },
  {
    type: "dropdown",
    key: "profile",
    title: "Profile",
    menuAlignEnd: true,
    items: [
      {
        key: "change-password",
        label: "Change Password",
        href: "/change-password",
        description: "Update your password",
      },
      {
        key: "logout",
        label: "Logout",
        href: "/login",
        description: "Sign out of your account",
      },
    ],
  },
];

const navTextClass = (active: boolean) =>
  active ? "font-medium text-[#d36838]" : "font-normal text-[#181512] hover:text-[#d36838]";

const linkClass = (active: boolean) =>
  `inline-flex min-h-[44px] items-center px-3 py-2 text-[0.875rem] tracking-normal no-underline transition-colors lg:ml-2 lg:min-h-0 lg:px-0 lg:py-0 xl:ml-4 ${navTextClass(active)}`;

function isItemActive(item: NavLinkItem, activeKey: string | undefined, pathname: string) {
  if (activeKey) return item.key === activeKey;
  return pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
}

function isDropdownActive(group: NavDropdownGroup, activeKey: string | undefined, pathname: string) {
  return group.items.some((item) => isItemActive(item, activeKey, pathname));
}

type MobileMenuToggleProps = {
  open: boolean;
  menuId: string;
  onClick: () => void;
};

function MobileMenuToggle({ open, menuId, onClick }: MobileMenuToggleProps) {
  return (
    <button
      type="button"
      className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[6px] border border-[#cbcbcb] bg-white shadow-sm transition-colors hover:border-[#999] hover:bg-[#f5f5f5] max-lg:inline-flex lg:hidden"
      aria-label="Toggle navigation"
      aria-expanded={open}
      aria-controls={menuId}
      onClick={onClick}
    >
      {open ? <IconClose className="text-[#181512]" /> : <IconMenu className="text-[#181512]" />}
    </button>
  );
}

export default function Header({ navEntries = defaultNavEntries, activeKey }: HeaderProps) {
  const pathname = usePathname();
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdownKey, setOpenDropdownKey] = useState<string | null>(null);
  const [mobileOpenDropdownKey, setMobileOpenDropdownKey] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const dropdownRefs = useRef<Record<string, HTMLLIElement | null>>({});

  const closeMenus = useCallback(() => {
    setMenuOpen(false);
    setOpenDropdownKey(null);
    setMobileOpenDropdownKey(null);
  }, []);

  useEffect(() => {
    if (openDropdownKey === null) return;
    const activeDropdownKey: string = openDropdownKey;

    function handlePointerDown(event: MouseEvent) {
      const el = dropdownRefs.current[activeDropdownKey];
      if (el && !el.contains(event.target as Node)) {
        setOpenDropdownKey(null);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenDropdownKey(null);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openDropdownKey]);

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        closeMenus();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") closeMenus();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen, closeMenus]);

  // Close menus when the route changes (e.g. browser back/forward).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset nav UI on route change
    closeMenus();
  }, [pathname, closeMenus]);

  return (
    <header
      ref={headerRef}
      className="fixed left-0 right-0 top-0 z-[1000] w-full border-b border-[#d4d4d0] bg-[var(--fhi-header-bg)]"
      style={{ fontFamily: fontFamilyHeading }}
    >
      {menuOpen ? (
        <button
          type="button"
          className="fixed inset-0 top-[var(--fhi-header-height)] z-0 cursor-default border-0 bg-black/25 lg:hidden"
          aria-label="Close navigation menu"
          tabIndex={-1}
          onClick={closeMenus}
        />
      ) : null}

      <AppContainer className="relative z-10 flex h-[var(--fhi-header-height)] items-center justify-between gap-3">
        <Link href="/auction" className="inline-flex shrink-0 items-center" aria-label="FH Liquidation Auction Tool">
          <Image
            src={assetPath("/logo_transperent.png")}
            alt="FH Liquidation Auction Tool"
            width={240}
            height={72}
            priority
            className="block h-[3rem] w-auto object-contain md:h-[3.25rem]"
          />
        </Link>

        <MobileMenuToggle
          open={menuOpen}
          menuId={menuId}
          onClick={() => setMenuOpen((prev) => !prev)}
        />

        <nav
          id={menuId}
          className={`${
            menuOpen ? "block" : "hidden lg:block"
          } absolute inset-x-0 top-full max-h-[calc(100vh-var(--fhi-header-height))] overflow-y-auto border-t border-[#d4d4d4] bg-white px-4 pb-4 pt-3 shadow-md max-lg:-mx-4 max-lg:px-4 sm:max-lg:-mx-6 sm:max-lg:px-6 lg:static lg:mx-0 lg:max-h-none lg:overflow-visible lg:border-0 lg:bg-transparent lg:shadow-none lg:p-0`}
          aria-label="Main navigation"
        >
          <ul className="m-0 flex list-none flex-col items-stretch gap-[0.35rem] p-0 lg:flex-row lg:flex-wrap lg:items-center lg:justify-end lg:gap-x-1 xl:gap-x-2">
            {navEntries.map((entry) => {
              if (entry.type === "link") {
                const active = isItemActive(entry, activeKey, pathname);
                return (
                  <li key={entry.key}>
                    <Link
                      href={entry.href}
                      className={linkClass(active)}
                      onClick={closeMenus}
                    >
                      {entry.label}
                    </Link>
                  </li>
                );
              }

              const groupActive = isDropdownActive(entry, activeKey, pathname);
              const dropdownOpen = openDropdownKey === entry.key;
              const mobileDropdownOpen = mobileOpenDropdownKey === entry.key;
              const triggerId = `nav-${entry.key}-trigger`;
              const menuPanelId = `nav-${entry.key}-menu`;
              const panelAlignClass = entry.menuAlignEnd ? "lg:right-0 lg:left-auto" : "lg:left-0";

              return (
                <li
                  key={entry.key}
                  ref={(el) => {
                    dropdownRefs.current[entry.key] = el;
                  }}
                  className="relative lg:ml-2 xl:ml-4"
                >
                  {/* Desktop dropdown trigger */}
                  <button
                    type="button"
                    id={triggerId}
                    className={`hidden w-full items-center justify-between gap-1.5 border-0 bg-transparent px-3 py-2 text-left text-[0.875rem] transition-colors lg:inline-flex lg:w-auto lg:justify-start lg:px-0 lg:py-0 ${navTextClass(groupActive)}`}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                    aria-controls={menuPanelId}
                    onClick={() => setOpenDropdownKey((key) => (key === entry.key ? null : entry.key))}
                  >
                    <span>{entry.title}</span>
                    <IconChevronDown
                      className={`shrink-0 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Mobile accordion trigger */}
                  <button
                    type="button"
                    className={`flex min-h-[44px] w-full items-center justify-between gap-2 border-0 bg-transparent px-3 py-2 text-left text-[0.875rem] transition-colors lg:hidden ${navTextClass(groupActive)}`}
                    aria-expanded={mobileDropdownOpen}
                    onClick={() =>
                      setMobileOpenDropdownKey((key) => (key === entry.key ? null : entry.key))
                    }
                  >
                    <span>{entry.title}</span>
                    <IconChevronDown
                      className={`shrink-0 transition-transform ${mobileDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Desktop dropdown panel */}
                  <ul
                    id={menuPanelId}
                    role="menu"
                    aria-labelledby={triggerId}
                    className={`${
                      dropdownOpen ? "lg:block" : "lg:hidden"
                    } m-0 hidden list-none rounded-[6px] border border-[#dee2e6] bg-white py-1 shadow-lg lg:absolute lg:top-full lg:z-[1100] lg:mt-1 lg:min-w-[240px] ${panelAlignClass}`}
                  >
                    {entry.items.map((item) => {
                      const active = isItemActive(item, activeKey, pathname);
                      return (
                        <li key={item.key} role="none">
                          <Link
                            href={item.href}
                            role="menuitem"
                            className={`block px-4 py-2.5 no-underline transition-colors hover:bg-[#f9f9f9] ${
                              active ? "bg-[#fff5f0] text-[#d36838]" : "text-[#181512]"
                            }`}
                            onClick={closeMenus}
                          >
                            <span className={`block text-[0.875rem] ${active ? "font-medium" : "font-normal"}`}>
                              {item.label}
                            </span>
                            {item.description ? (
                              <span className="mt-0.5 block text-xs font-normal leading-snug text-[#666]">
                                {item.description}
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Mobile sub-menu */}
                  <ul
                    className={`${
                      mobileDropdownOpen ? "block" : "hidden"
                    } m-0 mb-2 list-none border-l-2 border-[#d36838] py-1 pl-3 lg:hidden`}
                  >
                    {entry.items.map((item) => {
                      const active = isItemActive(item, activeKey, pathname);
                      return (
                        <li key={item.key}>
                          <Link
                            href={item.href}
                            className={`block rounded-[4px] px-3 py-2 no-underline transition-colors ${
                              active ? "bg-[#fff5f0] text-[#d36838]" : "text-[#181512] hover:bg-[#f5f5f5]"
                            }`}
                            onClick={closeMenus}
                          >
                            <span className={`block text-[0.875rem] ${active ? "font-medium" : "font-normal"}`}>
                              {item.label}
                            </span>
                            {item.description ? (
                              <span className="mt-0.5 block text-xs font-normal text-[#666]">{item.description}</span>
                            ) : null}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </nav>
      </AppContainer>
    </header>
  );
}
