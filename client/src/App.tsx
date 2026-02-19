import { Switch, Route } from "wouter";
import { HelmetProvider } from "react-helmet-async";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { RegistrationProvider } from "@/contexts/registration-context";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import Home from "@/pages/home";
import Partnership from "@/pages/partnership";
import Membership from "@/pages/membership";
import Board from "@/pages/board";
import GalleryPage from "@/pages/gallery";
import BlogPage from "@/pages/blog";
import BlogDetail from "@/pages/blog-detail";
import HotelDetail from "@/pages/hotel-detail";
import ExhibitionBooking from "@/pages/exhibition-booking";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import WorkPage from "@/pages/work";
import EventsPage from "@/pages/events";
import MarketplacePage from "@/pages/marketplace";
import MemberDirectoryPage from "@/pages/member-directory";
import LoginPage from "@/pages/login";
import ProfilePage from "@/pages/profile";
import NotFound from "@/pages/not-found";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/partnership" component={Partnership} />
      <Route path="/work" component={WorkPage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/marketplace" component={MarketplacePage} />
      <Route path="/member-directory" component={MemberDirectoryPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/profile" component={ProfilePage} />

      <Route path="/membership" component={Membership} />
      <Route path="/board" component={Board} />
      <Route path="/gallery" component={GalleryPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:id" component={BlogDetail} />
      <Route path="/hotels/:id" component={HotelDetail} />
      <Route path="/exhibition-booking" component={ExhibitionBooking} />
      <Route component={NotFound} />
    </Switch>
  );
}

import { AuthProvider } from "@/services/auth-context";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthProvider>
              <RegistrationProvider>
                <Toaster />
                <Router />
                <WhatsAppFloat />
              </RegistrationProvider>
            </AuthProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}


export default App;
