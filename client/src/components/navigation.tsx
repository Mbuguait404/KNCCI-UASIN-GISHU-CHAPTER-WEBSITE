import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";
import { useLocation } from "wouter";
import { Menu, X, Sun, Moon } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Speakers", href: "#speakers" },
  { label: "Program", href: "#program" },
  { label: "Venue", href: "#venue" },
  { label: "Gallery", href: "#gallery" },
  { label: "Partners", href: "#partners" },
  { label: "Contact", href: "#footer" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const isHomePage = location === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    setMobileOpen(false);
    if (!isHomePage && href.startsWith("#")) {
      // If not on home page, navigate to home first, then scroll
      window.location.href = `/${href}`;
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavClick = (href: string) => {
    if (isHomePage) {
      scrollToSection(href);
    } else {
      window.location.href = `/${href}`;
    }
  };

  return (
    <nav
      data-testid="navigation-bar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-2 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "py-4 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            if (isHomePage) {
              scrollToSection("#home");
            } else {
              window.location.href = "/";
            }
          }}
          className="flex items-center gap-2"
          data-testid="link-logo"
        >
          {/* Upload your logo image to client/public/ directory */}
          {/* Update the src path below to match your logo filename */}
          {/* Example: /kncci-logo.png or /kncci-logo.svg */}
          <img 
            src="/kncci_logo-removebg-preview.png" 
            alt="KNCCI - Kenya National Chamber of Commerce and Industry" 
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </a>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-md hover-elevate"
              data-testid={`link-nav-${link.label.toLowerCase()}`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            className="hidden sm:flex"
            data-testid="button-theme-toggle"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          <Button
            onClick={() => {
              if (location === "/partnership") {
                return; // Already on partnership page
              }
              window.location.href = "/partnership";
            }}
            variant="outline"
            className="hidden sm:flex border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            data-testid="button-become-partner-nav"
          >
            Become a Partner
          </Button>

          <Button
            onClick={() => scrollToSection("#registration")}
            className="hidden sm:flex bg-primary text-primary-foreground"
            data-testid="button-register-nav"
          >
            Register Now
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="lg:hidden"
                data-testid="button-mobile-menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="text-left px-4 py-3 text-lg font-medium text-foreground hover:bg-accent rounded-md transition-colors"
                    data-testid={`link-mobile-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </button>
                ))}
                <div className="border-t border-border my-4" />
                <Button
                  onClick={() => {
                    setMobileOpen(false);
                    if (location !== "/partnership") {
                      window.location.href = "/partnership";
                    }
                  }}
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  data-testid="button-become-partner-mobile"
                >
                  Become a Partner
                </Button>
                <Button
                  onClick={() => scrollToSection("#registration")}
                  className="w-full bg-primary text-primary-foreground"
                  data-testid="button-register-mobile"
                >
                  Register Now
                </Button>
                <Button
                  variant="outline"
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-2"
                  data-testid="button-theme-toggle-mobile"
                >
                  {theme === "light" ? (
                    <>
                      <Moon className="h-4 w-4" /> Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun className="h-4 w-4" /> Light Mode
                    </>
                  )}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
