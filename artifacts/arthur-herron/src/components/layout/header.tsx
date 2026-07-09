import { useCart } from "@/lib/cart";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function Header() {
  const { totalItems } = useCart();
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/our-story", label: "Our Story" },
    { href: "/delivery", label: "Delivery" },
    { href: "/about", label: "Our Promise" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 border-b border-border ${
        isScrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm" : "bg-background"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 h-16 sm:h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] flex flex-col gap-6 p-6">
              <Link href="/" className="flex items-center justify-center pt-4">
                <div className={theme === 'dark' ? "bg-[#F5F1E8] rounded-xl px-4 py-2" : ""}>
                  <img
                    src="/brand/logo-full.png"
                    alt="Arthur Herron"
                    className="h-24 w-auto"
                  />
                </div>
              </Link>
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      location === link.href ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-4 pb-4">
                <a href="https://wa.me/263771234567" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                  <Phone className="h-4 w-4" />
                  +263 77 123 4567
                </a>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Harare, Zimbabwe
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <div className={theme === 'dark' ? "bg-[#F5F1E8] rounded-lg px-2 py-1 hidden sm:block" : "hidden sm:block"}>
              <img
                src="/brand/logo-full.png"
                alt="Arthur Herron"
                className="h-12 lg:h-14 w-auto"
              />
            </div>
            <div className={theme === 'dark' ? "bg-[#F5F1E8] rounded-lg p-1 sm:hidden" : "sm:hidden"}>
              <img
                src="/brand/logo-icon-new.png"
                alt="Arthur Herron"
                className="h-7 w-auto"
              />
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
