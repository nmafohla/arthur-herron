import { Link } from "wouter";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";
import { useTheme } from "next-themes";

export function Footer() {
  const { theme } = useTheme();
  
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="flex flex-col items-start">
            <Link href="/" className="mb-6">
              <img
                src={theme === 'dark' ? "/brand/logo-stacked-dark.svg" : "/brand/logo-stacked.svg"}
                alt="Arthur Herron"
                className="h-24 w-auto"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Premium butchers serving Zimbabwe with the finest cuts, freshest meats, and reliable delivery right to your door.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-6 text-foreground">Shop</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?categorySlug=beef" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Premium Beef
                </Link>
              </li>
              <li>
                <Link href="/shop?categorySlug=braai-packs" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Braai Packs
                </Link>
              </li>
              <li>
                <Link href="/shop?categorySlug=poultry" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Poultry
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-6 text-foreground">Information</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Our Promise
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Delivery Areas
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-6 text-foreground">Get In Touch</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-muted-foreground text-sm items-start">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>123 Main Street<br />Harare, Zimbabwe</span>
              </li>
              <li className="flex gap-3 text-muted-foreground text-sm items-center">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href="tel:+263771234567" className="hover:text-primary transition-colors">+263 77 123 4567</a>
              </li>
              <li className="flex gap-3 text-muted-foreground text-sm items-center">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a href="mailto:hello@arthurherron.com" className="hover:text-primary transition-colors">hello@arthurherron.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Arthur Herron Butchers. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
