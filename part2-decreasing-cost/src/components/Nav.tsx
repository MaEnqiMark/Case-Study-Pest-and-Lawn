"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/route-planning", label: "Route Planning" },
  { href: "/scheduling", label: "Scheduling" },
  { href: "/inventory", label: "Inventory" },
  { href: "/reports", label: "Tech Reports" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center gap-8">
      <span className="font-bold text-lg mr-4">Pest & Lawn Ops</span>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`text-sm hover:text-green-400 transition-colors ${
            pathname === link.href ? "text-green-400 font-semibold" : "text-gray-300"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
