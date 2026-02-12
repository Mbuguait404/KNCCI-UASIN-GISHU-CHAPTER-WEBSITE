import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";
import { useLocation } from "wouter";
import { useRegistration } from "@/contexts/registration-context";
import { Menu, X, Sun, Moon } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Speakers", href: "#speakers" },
  { label: "Program", href: "#program" },
  { label: "Partners", href: "#partners" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const isHomePage = location === "/";
  const { openRegistration } = useRegistration();

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
          ? "pt-4 pb-2 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "pt-6 pb-4 bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 w-full flex items-center justify-between gap-4">
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
          className="flex items-center gap-3"
          data-testid="link-logo"
        >
          {/* Chapter Logo */}
          <img 
            src="https://solby.sfo3.digitaloceanspaces.com/1770900740026-kncci_logo-removebg-preview.png" 
            alt="KNCCI Uasin Gishu Chapter" 
            className="h-12 sm:h-16 w-auto object-contain"
            width={220}
            height={64}
            loading="eager"
            fetchpriority="high"
          />
          {/* Divider */}
          <div className={`h-8 sm:h-10 w-px mx-1 transition-colors duration-300 ${
            isScrolled ? "bg-gray-400" : "bg-white/40"
          }`} />
          {/* County Logo */}
          <img 
            src="/county-removebg-preview.png" 
            alt="Uasin Gishu County" 
            className="h-12 sm:h-16 w-auto object-contain"
            width={220}
            height={64}
            loading="eager"
            fetchpriority="high"
          />
        </a>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-md hover-elevate ${
                isScrolled || !isHomePage
                  ? "text-foreground/80 hover:text-foreground"
                  : "text-white/90 hover:text-white"
              }`}
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
            className={`hidden sm:flex ${
              isScrolled || !isHomePage
                ? "text-foreground"
                : "text-white hover:bg-white/20"
            }`}
            data-testid="button-theme-toggle"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          <Button
            onClick={() => {
              openRegistration();
              setMobileOpen(false);
            }}
            className={`hidden sm:flex ${
              isScrolled || !isHomePage
                ? "bg-primary text-primary-foreground"
                : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20"
            }`}
            data-testid="button-register-nav"
          >
            Register Now
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className={`lg:hidden ${
                  isScrolled || !isHomePage
                    ? "text-foreground"
                    : "text-white hover:bg-white/20"
                }`}
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
                    openRegistration();
                    setMobileOpen(false);
                  }}
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
