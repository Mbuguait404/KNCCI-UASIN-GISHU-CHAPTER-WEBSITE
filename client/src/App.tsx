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
import HotelDetail from "@/pages/hotel-detail";
import ExhibitionBooking from "@/pages/exhibition-booking";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/partnership" component={Partnership} />
      <Route path="/membership" component={Membership} />
      <Route path="/hotels/:id" component={HotelDetail} />
      <Route path="/exhibition-booking" component={ExhibitionBooking} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <RegistrationProvider>
              <Toaster />
              <Router />
              <WhatsAppFloat />
            </RegistrationProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
