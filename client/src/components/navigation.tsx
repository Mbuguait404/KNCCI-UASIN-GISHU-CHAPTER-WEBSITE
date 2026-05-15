import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";
import { useLocation, Link } from "wouter";
import { useRegistration } from "@/contexts/registration-context";
import { useMembership } from "@/contexts/membership-context";
import { Menu, Moon, Sun, ChevronDown, User, LogOut, Home, Info, CalendarDays, ShoppingBag, Phone, ChevronRight, Building2 } from "lucide-react";
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
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/services/auth-context";


interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: { label: string; href: string; description?: string }[];
}

const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
  {
    label: "About Us",
    icon: <Building2 className="w-4 h-4" />,
    children: [
      { label: "About", href: "/about", description: "Learn about our mission and vision." },
      { label: "Who We Are", href: "/about#who-we-are", description: "Membership, Governance, and Partnerships." },
      { label: "Our Work", href: "/work", description: "Explore our impact and projects." },
      { label: "Chairman's Word", href: "/about#chairman-message", description: "A message from Willy K. Kenei." },
      { label: "Board of Directors", href: "/board", description: "Meet our leadership team." },
      { label: "Membership", href: "/membership", description: "Join our membership program." },
    ],
  },
  {
    label: "News & Events",
    icon: <CalendarDays className="w-4 h-4" />,
    children: [
      { label: "Events", href: "/events", description: "Join our upcoming conferences and workshops." },
      { label: "Blog", href: "/blog", description: "Latest news and updates." },
      { label: "Gallery", href: "/gallery", description: "Photos from our events." },
    ],
  },
  {
    label: "Marketplace",
    icon: <ShoppingBag className="w-4 h-4" />,
    children: [
      { label: "Marketplace", href: "/marketplace", description: "Discover local products and services." },
    ],
  },
  { label: "Contact", href: "/contact", icon: <Phone className="w-4 h-4" /> },
];

export function Navigation() {
  const isScrolled = true;
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const isHomePage = location === "/";
  // preserving context usage just in case, primarily for mobile or if needed later
  const { openRegistration } = useRegistration();
  const { openMembership } = useMembership();
  const { user, isAuthenticated } = useAuth();

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
        ? "pt-2 pb-1.5 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
        : isHomePage
          ? "pt-3 pb-2 bg-black/40 backdrop-blur-md border-b border-white/10"
          : "pt-3 pb-2 bg-transparent"
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
              src="/UG_chapter_logo-removebg-preview.png"
              alt="KNCCI UG Chapter Logo"
              className={`h-10 sm:h-12 w-auto object-contain transition-all duration-300 ${isScrolled || !isHomePage
                ? "drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
                : "drop-shadow-[0_0_2px_rgba(255,255,255,0.9)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                }`}
              width={180}
              height={48}
            />
            <div className={`h-6 sm:h-7 w-px mx-1 transition-colors duration-300 ${isScrolled ? "bg-gray-400" : "bg-white/40"
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
          <Button
            variant="outline"
            size="sm"
            onClick={openMembership}
            className={cn(
              "hidden xl:inline-flex font-medium transition-colors",
              isScrolled || !isHomePage
                ? "border-border text-foreground hover:bg-accent"
                : "border-white/30 text-white hover:bg-white/10"
            )}
          >
            Be a Member
          </Button>

          {isAuthenticated ? (
            <Link href="/profile">
              <Button
                size="sm"
                className={cn(
                  "font-medium transition-colors flex gap-2 items-center",
                  isScrolled || !isHomePage
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20"
                )}
              >
                <div className="w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center text-[10px] font-bold">
                  {user?.name?.[0]}
                </div>
                Profile
              </Button>
            </Link>
          ) : (
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
          )}

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
            <SheetContent side="right" className="w-[300px] sm:w-[360px] p-0 overflow-y-auto flex flex-col border-l-0 shadow-2xl">
              {/* Branded Header */}
              <div className="relative bg-primary px-5 py-5 flex items-center gap-3 flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 ring-1 ring-white/20">
                  <img
                    src="/UG_chapter_logo-removebg-preview.png"
                    alt="KNCCI"
                    className="h-7 w-auto object-contain brightness-0 invert"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <SheetHeader className="p-0 text-left space-y-0">
                    <SheetTitle className="text-white font-extrabold text-sm tracking-tight leading-none">KNCCI</SheetTitle>
                  </SheetHeader>
                  <p className="text-white/70 text-[11px] font-medium mt-0.5">Uasin Gishu Chapter</p>
                </div>
                {/* Decorative ring */}
                <div className="absolute -bottom-3 left-5 right-5 h-px bg-gradient-to-r from-white/0 via-white/20 to-white/0" />
              </div>

              {/* Nav Items */}
              <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {navItems.map((item, index) => (
                  <div key={index}>
                    {item.children ? (
                      <Accordion type="single" collapsible className="w-full border-none">
                        <AccordionItem value={`item-${index}`} className="border-none">
                          <AccordionTrigger className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold hover:no-underline transition-all duration-150",
                            "hover:bg-primary/8 text-foreground data-[state=open]:bg-primary/10 data-[state=open]:text-primary",
                            "[&>svg:last-child]:text-muted-foreground [&>svg:last-child]:w-4 [&>svg:last-child]:h-4"
                          )}>
                            <span className={cn(
                              "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                              "bg-muted text-muted-foreground group-data-[state=open]:bg-primary/10 group-data-[state=open]:text-primary"
                            )}>
                              {item.icon}
                            </span>
                            {item.label}
                          </AccordionTrigger>
                          <AccordionContent className="pb-1 pt-0">
                            <div className="ml-10 pl-3 border-l-2 border-primary/20 space-y-0.5">
                              {item.children.map((child) => (
                                <Link key={child.href} href={child.href}>
                                  <a
                                    className={cn(
                                      "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
                                      location === child.href
                                        ? "bg-primary/10 text-primary font-semibold"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                                    )}
                                    onClick={() => setMobileOpen(false)}
                                  >
                                    <ChevronRight className="w-3 h-3 flex-shrink-0 opacity-50" />
                                    {child.label}
                                  </a>
                                </Link>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <Link href={item.href!}>
                        <a
                          className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-150",
                            location === item.href
                              ? "bg-primary/10 text-primary"
                              : "text-foreground hover:bg-muted/60 hover:text-foreground"
                          )}
                          onClick={() => setMobileOpen(false)}
                        >
                          <span className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                            location === item.href
                              ? "bg-primary/15 text-primary"
                              : "bg-muted text-muted-foreground"
                          )}>
                            {item.icon}
                          </span>
                          {item.label}
                          {location === item.href && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                          )}
                        </a>
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* Footer / Auth Section */}
              <div className="flex-shrink-0 px-4 pb-6 pt-4 border-t border-border/40 bg-muted/30 space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-3 bg-background rounded-xl border border-border/50 shadow-sm">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0">
                        {user?.name?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-foreground leading-tight truncate">{user?.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                      </div>
                    </div>
                    <Link href="/profile">
                      <Button
                        className="w-full h-11 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                        onClick={() => setMobileOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        My Dashboard
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1 pb-1">Get Started</p>
                    <Button
                      variant="outline"
                      className="w-full h-11 rounded-xl border-border font-semibold gap-2 justify-center"
                      onClick={() => {
                        setMobileOpen(false);
                        openMembership();
                      }}
                    >
                      <Building2 className="h-4 w-4 text-primary" />
                      Become a Member
                    </Button>
                    <Link href="/login">
                      <Button
                        className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-bold gap-2 justify-center"
                        onClick={() => setMobileOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
