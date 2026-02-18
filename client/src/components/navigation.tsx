import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";
import { useLocation, Link } from "wouter";
import { useRegistration } from "@/contexts/registration-context";
import { Menu, Moon, Sun, ChevronDown } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string; description?: string }[];
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    children: [
      { label: "About", href: "/about", description: "Learn about our mission and vision." },
      { label: "Who We Are", href: "/about#who-we-are", description: "Membership, Governance, and Partnerships." },
      { label: "Chairman's Word", href: "/about#chairman-message", description: "A message from Willy K. Kenei." },
      { label: "Board of Directors", href: "/board", description: "Meet our leadership team." },
    ],
  },
  { label: "Our Work", href: "/work" },
  { label: "Events", href: "/events" },
  {
    label: "Media",
    children: [
      { label: "Blog", href: "/blog", description: "Latest news and updates." },
      { label: "Gallery", href: "/gallery", description: "Photos from our events." },
    ],
  },
  {
    label: "Marketplace",
    children: [
      { label: "Marketplace", href: "/marketplace", description: "Discover local products and services." },
      { label: "Member Directory", href: "/member-directory", description: "Browse and connect with verified members." },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const isHomePage = location === "/";
  // preserving context usage just in case, primarily for mobile or if needed later
  const { openRegistration } = useRegistration();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navTriggerClass = (isActive: boolean) => cn(
    navigationMenuTriggerStyle(),
    "bg-transparent hover:bg-white/10 focus:bg-white/10 transition-colors cursor-pointer",
    isScrolled || !isHomePage
      ? "text-foreground hover:text-foreground/80 focus:text-foreground/80 data-[active]:bg-primary/10 data-[state=open]:bg-primary/10"
      : "text-white hover:text-white/80 focus:text-white/80 hover:bg-white/10 data-[active]:bg-white/20 data-[state=open]:bg-white/20"
  );

  return (
    <nav
      data-testid="navigation-bar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "pt-4 pb-2 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
        : isHomePage
          ? "pt-6 pb-4 bg-black/40 backdrop-blur-md border-b border-white/10"
          : "pt-6 pb-4 bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/">
          <a
            className={`flex items-center gap-3 rounded-lg px-2 py-1.5 transition-all duration-300 ${isScrolled || !isHomePage ? "bg-transparent" : "bg-white/10 backdrop-blur-sm"
              }`}
            data-testid="link-logo"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img
              src="https://solby.sfo3.digitaloceanspaces.com/1770900740026-kncci_logo-removebg-preview.png"
              alt="KNCCI Logo"
              className={`h-12 sm:h-16 w-auto object-contain transition-all duration-300 ${isScrolled || !isHomePage
                ? "drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
                : "drop-shadow-[0_0_2px_rgba(255,255,255,0.9)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                }`}
              width={220}
              height={64}
            />
            <div className={`h-8 sm:h-10 w-px mx-1 transition-colors duration-300 ${isScrolled ? "bg-gray-400" : "bg-white/40"
              }`} />
          </a>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.label}>
                  {item.children ? (
                    <>
                      <NavigationMenuTrigger className={navTriggerClass(false)}>
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-popover">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <NavigationMenuLink asChild>
                                <Link href={child.href}>
                                  <a
                                    className={cn(
                                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                    )}
                                  >
                                    <div className="text-sm font-medium leading-none text-foreground">{child.label}</div>
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                                      {child.description}
                                    </p>
                                  </a>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link href={item.href!}>
                      <NavigationMenuLink className={navTriggerClass(location === item.href)}>
                        {item.label}
                      </NavigationMenuLink>
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/membership">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "hidden xl:inline-flex font-medium transition-colors",
                isScrolled || !isHomePage
                  ? "border-border text-foreground hover:bg-accent"
                  : "border-white/30 text-white hover:bg-white/10"
              )}
            >
              Be a Member
            </Button>
          </Link>

          <Link href="/login">
            <Button
              size="sm"
              className={cn(
                "font-medium transition-colors",
                isScrolled || !isHomePage
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20"
              )}
            >
              Login
            </Button>
          </Link>

          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            className={cn(
              "transition-colors",
              isScrolled || !isHomePage ? "text-foreground hover:bg-accent" : "text-white hover:bg-white/20"
            )}
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            className={cn(
              isScrolled || !isHomePage ? "text-foreground hover:bg-accent" : "text-white hover:bg-white/20"
            )}
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  isScrolled || !isHomePage ? "text-foreground hover:bg-accent" : "text-white hover:bg-white/20"
                )}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item, index) => (
                  <div key={index}>
                    {item.children ? (
                      <Accordion type="single" collapsible className="w-full border-none">
                        <AccordionItem value={`item-${index}`} className="border-none">
                          <AccordionTrigger className="py-2 text-lg font-medium hover:no-underline text-foreground">
                            {item.label}
                          </AccordionTrigger>
                          <AccordionContent className="flex flex-col gap-2 pl-4">
                            {item.children.map((child) => (
                              <Link key={child.href} href={child.href}>
                                <a
                                  className="text-base text-muted-foreground hover:text-primary py-2 block transition-colors"
                                  onClick={() => setMobileOpen(false)}
                                >
                                  {child.label}
                                </a>
                              </Link>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <Link href={item.href!}>
                        <a
                          className="block py-2 text-lg font-medium hover:text-primary transition-colors text-foreground"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </a>
                      </Link>
                    )}
                  </div>
                ))}

                <div className="border-t border-border my-4" />

                <Link href="/membership">
                  <Button
                    variant="outline"
                    className="w-full justify-start mt-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    Be a Member
                  </Button>
                </Link>

                <Link href="/login">
                  <Button
                    className="w-full justify-start bg-primary text-primary-foreground mt-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
