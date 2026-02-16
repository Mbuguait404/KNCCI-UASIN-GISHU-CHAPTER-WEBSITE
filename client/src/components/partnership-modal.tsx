import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  insertSponsorRequestSchema,
  type InsertSponsorRequest,
} from "@shared/schema";
import {
  Loader2,
  Send,
  CreditCard,
  Smartphone,
  Copy,
  CheckCircle2,
} from "lucide-react";
import type { PartnershipPackage } from "@/data/partnership-data";
import { cn } from "@/lib/utils";

const TIER_OPTIONS = ["Platinum", "Gold", "Silver", "Bronze", "Brass"] as const;

interface PartnershipModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPackage: PartnershipPackage | null;
}

export function PartnershipModal({
  isOpen,
  onOpenChange,
  selectedPackage,
}: PartnershipModalProps) {
  const { toast } = useToast();

  const sponsorForm = useForm<InsertSponsorRequest>({
    resolver: zodResolver(insertSponsorRequestSchema),
    defaultValues: {
      organization: "",
      contactName: "",
      email: "",
      phone: "",
      tier: undefined,
      message: "",
    },
  });

  const sponsorMutation = useMutation({
    mutationFn: async (data: InsertSponsorRequest) => {
      return apiRequest("POST", "/api/sponsor-requests", data);
    },
    onSuccess: () => {
      toast({
        title: "Request submitted",
        description:
          "Thank you for your interest in becoming a sponsor. We will contact you shortly.",
      });
      sponsorForm.reset();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description:
          error.message || "Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (isOpen && selectedPackage) {
      sponsorForm.setValue(
        "tier",
        selectedPackage.tier as InsertSponsorRequest["tier"]
      );
    }
  }, [isOpen, selectedPackage, sponsorForm]);

  const onSponsorSubmit = (data: InsertSponsorRequest) => {
    sponsorMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col z-[100]"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {selectedPackage ? (
              <>
                <Badge
                  className={cn(
                    "bg-gradient-to-br border-0 font-semibold shadow-sm",
                    selectedPackage.color,
                    selectedPackage.textColor
                  )}
                >
                  {selectedPackage.tier} Package
                </Badge>
                <span className="text-foreground">
                  KES {selectedPackage.value}
                </span>
              </>
            ) : (
              "Create Partnership Request"
            )}
          </DialogTitle>
          <DialogDescription>
            {selectedPackage?.description ??
              "Submit your details to become a sponsor. Our team will get in touch."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto space-y-6 pr-2">
          <Form {...sponsorForm}>
            <form
              onSubmit={sponsorForm.handleSubmit(onSponsorSubmit)}
              className="space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={sponsorForm.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization / Company</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Your company name"
                          data-testid="input-sponsor-organization"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={sponsorForm.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Full name"
                          data-testid="input-sponsor-contact"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={sponsorForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="you@company.com"
                          data-testid="input-sponsor-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={sponsorForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="+254 700 000 000"
                          data-testid="input-sponsor-phone"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={sponsorForm.control}
                name="tier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partnership tier of interest</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-sponsor-tier">
                          <SelectValue placeholder="Select a tier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-[110]">
                        {TIER_OPTIONS.map((tier) => (
                          <SelectItem key={tier} value={tier}>
                            {tier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={sponsorForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Tell us about your goals or questions..."
                        className="min-h-[80px]"
                        data-testid="input-sponsor-message"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary text-primary-foreground"
                disabled={sponsorMutation.isPending}
                data-testid="button-sponsor-submit"
              >
                {sponsorMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit sponsor request
                  </>
                )}
              </Button>
            </form>
          </Form>

          <Card className="p-4 border border-border bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-4 w-4 text-primary" />
              <h3 className="font-bold text-sm text-primary">
                Payment Information
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              After submitting your request, make payment using one of the
              methods below. Include your organization name as the payment
              reference.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-background border border-border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-xs font-semibold text-foreground">
                    M-Pesa Paybill
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs font-mono font-bold text-foreground bg-muted px-2 py-1 rounded">
                    7056475
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("7056475");
                      toast({
                        title: "Copied!",
                        description: "Paybill number copied to clipboard",
                      });
                    }}
                    className="text-primary hover:text-primary/80 transition-colors"
                    title="Copy paybill number"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="bg-background border border-border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                  <span className="text-xs font-semibold text-foreground">
                    Bank Transfer
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs font-mono font-bold text-foreground bg-muted px-2 py-1 rounded">
                    1181182263
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("1181182263");
                      toast({
                        title: "Copied!",
                        description: "Account number copied to clipboard",
                      });
                    }}
                    className="text-primary hover:text-primary/80 transition-colors"
                    title="Copy account number"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  KCB Bank
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Note:</strong> Include your
                organization name as the payment reference.
              </p>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
