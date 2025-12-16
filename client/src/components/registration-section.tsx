import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertRegistrationSchema, type InsertRegistration } from "@shared/schema";
import { Check, Users, Calendar, Award, Loader2 } from "lucide-react";

const benefits = [
  { icon: Users, text: "Network with 500+ business leaders" },
  { icon: Calendar, text: "Access to all 3 days of sessions" },
  { icon: Award, text: "Certificate of attendance" },
];

export function RegistrationSection() {
  const { toast } = useToast();
  
  const form = useForm<InsertRegistration>({
    resolver: zodResolver(insertRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      organization: "",
      jobTitle: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertRegistration) => {
      return apiRequest("POST", "/api/registrations", data);
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful!",
        description: "Thank you for registering. You will receive a confirmation email shortly.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again later or contact us for assistance.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertRegistration) => {
    registerMutation.mutate(data);
  };

  return (
    <section
      id="registration"
      className="py-20 sm:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden"
      data-testid="section-registration"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Secure Your Spot
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6" data-testid="text-registration-title">
            Register Now
          </h2>
          <p className="text-lg text-white/80 leading-relaxed">
            Don't miss this opportunity to be part of Kenya's premier business event. 
            Early registration ensures your place among industry leaders.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
          <div className="space-y-8">
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-4" data-testid={`benefit-${index}`}>
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-lg text-white/90">{benefit.text}</span>
                </div>
              ))}
            </div>

            <Card className="p-6 bg-white/5 border-white/10">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary" data-testid="stat-attendees">500+</div>
                  <div className="text-sm text-white/60">Attendees</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary" data-testid="stat-speakers">50+</div>
                  <div className="text-sm text-white/60">Speakers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-chart-3" data-testid="stat-sessions">30+</div>
                  <div className="text-sm text-white/60">Sessions</div>
                </div>
              </div>
            </Card>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Check className="w-4 h-4 text-secondary" />
                <span>Free WiFi</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Check className="w-4 h-4 text-secondary" />
                <span>Meals Included</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Check className="w-4 h-4 text-secondary" />
                <span>Event Materials</span>
              </div>
            </div>
          </div>

          <Card className="p-8 bg-white dark:bg-card border-0 shadow-2xl">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Complete Your Registration
            </h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">First Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="John"
                            data-testid="input-first-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Last Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Doe"
                            data-testid="input-last-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="john@company.com"
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="+254 700 000 000"
                          data-testid="input-phone"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Organization</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Company Name"
                          data-testid="input-organization"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Job Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="CEO, Manager, etc."
                          data-testid="input-job-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary text-primary-foreground mt-4"
                  disabled={registerMutation.isPending}
                  data-testid="button-submit-registration"
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Register for Event"
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  By registering, you agree to receive event-related communications from KNCCI.
                </p>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </section>
  );
}
