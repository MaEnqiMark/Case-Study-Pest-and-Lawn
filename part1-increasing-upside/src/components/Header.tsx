"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services & Plans" },
    { path: "/find-treatment", label: "Find the Right Treatment" },
    { path: "/shop", label: "Shop" },
    { path: "/cart", label: "Cart" },
    { path: "/ai-chatbot", label: "AI Chatbot" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">PL</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">PestxLawn</h1>
              <p className="text-xs text-gray-600">Pest & Lawn Care</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`transition-colors relative text-sm whitespace-nowrap ${
                  isActive(item.path)
                    ? "text-green-600 font-semibold"
                    : "text-gray-700 hover:text-green-600"
                }`}
              >
                {item.path === "/cart" ? (
                  <span className="flex items-center gap-1">
                    <ShoppingCart className="w-4 h-4" />
                    {itemCount > 0 && (
                      <span className="bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </span>
                ) : (
                  item.label
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 border-r border-gray-200 pr-3">
                <User className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                <button
                  onClick={logout}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-1"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-green-600 transition-colors border-r border-gray-200 pr-3"
              >
                <User className="w-4 h-4" />
                Login
              </Link>
            )}
            <a
              href="tel:+15551234567"
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>(555) 123-4567</span>
            </a>
          </div>

          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block py-2 transition-colors ${
                  isActive(item.path)
                    ? "text-green-600 font-semibold"
                    : "text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <div className="flex items-center justify-between py-2 mt-2 border-t border-gray-100 pt-4">
                <span className="text-sm text-gray-700 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {user?.name}
                </span>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-1 text-sm text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="block py-2 text-gray-700 hover:text-green-600 transition-colors mt-2 border-t border-gray-100 pt-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
            <a
              href="tel:+15551234567"
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors mt-4 inline-flex"
            >
              <Phone className="w-4 h-4" />
              <span>(555) 123-4567</span>
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
