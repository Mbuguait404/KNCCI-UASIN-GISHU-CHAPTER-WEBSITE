import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    setMobileOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("#home");
          }}
          className="flex items-center gap-2"
          data-testid="link-logo"
        >
          <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">K</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-lg text-foreground">KNCCI</span>
            <span className="text-xs block text-muted-foreground -mt-1">Chamber of Commerce</span>
          </div>
        </a>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
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
                    onClick={() => scrollToSection(link.href)}
                    className="text-left px-4 py-3 text-lg font-medium text-foreground hover:bg-accent rounded-md transition-colors"
                    data-testid={`link-mobile-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </button>
                ))}
                <div className="border-t border-border my-4" />
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
