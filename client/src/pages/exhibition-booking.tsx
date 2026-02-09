import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ArrowLeft, Building2, Users, Check } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/seo/seo-head";

export default function ExhibitionBookingPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    memberType: "",
    boothCount: "1",
    additionalRequirements: "",
    agreeTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: "Request Submitted Successfully!",
      description: "We will contact you within 24 hours to confirm your exhibition space.",
    });
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="py-20 sm:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-4">
                  Exhibition Space Request Submitted!
                </h1>
                <p className="text-muted-foreground mb-6">
                  Thank you for your interest in exhibiting at the Eldoret International Business Summit 2026. 
                  Our team will review your request and contact you within 24 hours to confirm your booking 
                  and provide payment details.
                </p>
                <div className="bg-muted p-4 rounded-lg mb-6 text-left">
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>What happens next?</strong>
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• We will review your application</li>
                    <li>• You will receive a confirmation email</li>
                    <li>• Payment instructions will be provided</li>
                    <li>• Booth assignment details</li>
                  </ul>
                </div>
                <Link href="/">
                  <Button className="bg-primary text-primary-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Home
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Exhibition Booking - Eldoret International Business Summit 2026"
        description="Reserve your exhibition booth at the Eldoret International Business Summit 2026. Showcase your products and services to 1000+ business leaders."
        keywords={[
          "Exhibition Booking",
          "Trade Show Eldoret",
          "Business Exhibition Kenya",
          "KNCCI Exhibition",
          "Eldoret Trade Fair",
        ]}
        canonicalUrl={typeof window !== "undefined" ? window.location.href : ""}
        type="website"
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          {/* Header Section */}
          <section className="py-20 sm:py-28 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <Link href="/">
                  <Button variant="ghost" className="mb-4 -ml-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                  Reserve Your Space
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
                  Exhibition Space Request
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Complete the form below to reserve your exhibition booth at the Eldoret International Business Summit 2026
                </p>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="py-20 sm:py-28 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Form */}
                  <div className="lg:col-span-2">
                    <Card className="p-6 sm:p-8 border border-border">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            Company Information
                          </h2>
                          
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="companyName">Company Name *</Label>
                              <Input
                                id="companyName"
                                value={formData.companyName}
                                onChange={(e) => handleChange("companyName", e.target.value)}
                                placeholder="Enter your company name"
                                required
                              />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="contactPerson">Contact Person *</Label>
                                <Input
                                  id="contactPerson"
                                  value={formData.contactPerson}
                                  onChange={(e) => handleChange("contactPerson", e.target.value)}
                                  placeholder="Full name"
                                  required
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input
                                  id="phone"
                                  type="tel"
                                  value={formData.phone}
                                  onChange={(e) => handleChange("phone", e.target.value)}
                                  placeholder="+254 XXX XXX XXX"
                                  required
                                />
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="email">Email Address *</Label>
                              <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder="company@example.com"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-border pt-6">
                          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Exhibition Details
                          </h2>
                          
                          <div className="space-y-4">
                            <div>
                              <Label>KNCCI Membership Status *</Label>
                              <Select 
                                value={formData.memberType} 
                                onValueChange={(value) => handleChange("memberType", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select membership status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="member">KNCCI Member (KES 30,000)</SelectItem>
                                  <SelectItem value="non-member">Non-Member (KES 40,000)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="boothCount">Number of Booths *</Label>
                              <Select 
                                value={formData.boothCount} 
                                onValueChange={(value) => handleChange("boothCount", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select number of booths" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 Booth (3x3 meters)</SelectItem>
                                  <SelectItem value="2">2 Booths (6x3 meters)</SelectItem>
                                  <SelectItem value="3">3 Booths (9x3 meters)</SelectItem>
                                  <SelectItem value="4+">4+ Booths (Contact for pricing)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="additionalRequirements">Additional Requirements</Label>
                              <Textarea
                                id="additionalRequirements"
                                value={formData.additionalRequirements}
                                onChange={(e) => handleChange("additionalRequirements", e.target.value)}
                                placeholder="Any special requirements, equipment needs, or questions..."
                                rows={4}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-border pt-6">
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              id="terms"
                              checked={formData.agreeTerms}
                              onCheckedChange={(checked) => handleChange("agreeTerms", checked as boolean)}
                              required
                            />
                            <div className="space-y-1 leading-none">
                              <Label htmlFor="terms" className="text-sm font-normal">
                                I agree to the terms and conditions. I understand that submission of this form 
                                does not guarantee space allocation until payment is confirmed. *
                              </Label>
                            </div>
                          </div>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full bg-primary text-primary-foreground py-6 text-lg"
                          disabled={isSubmitting || !formData.agreeTerms}
                        >
                          {isSubmitting ? "Submitting..." : "Submit Request"}
                        </Button>
                      </form>
                    </Card>
                  </div>

                  {/* Sidebar Info */}
                  <div className="space-y-6">
                    <Card className="p-6 bg-primary/5 border-primary/20">
                      <h3 className="font-bold text-lg mb-4 text-primary">Pricing Summary</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">KNCCI Members:</span>
                          <span className="font-semibold">KES 30,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Non-Members:</span>
                          <span className="font-semibold">KES 40,000</span>
                        </div>
                        <div className="border-t border-border pt-3 mt-3">
                          <p className="text-xs text-muted-foreground">
                            Per booth (3x3 meters). Price inclusive of:
                          </p>
                          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                            <li>• Exhibition space</li>
                            <li>• 1 Gala dinner card</li>
                            <li>• Logo on materials</li>
                            <li>• Certificate</li>
                          </ul>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 border border-border">
                      <h3 className="font-bold text-lg mb-4">Need Help?</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Have questions about exhibiting? Contact our team:
                      </p>
                      <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground">
                          <strong>Email:</strong><br />
                          exhibitions@eldoretsummit.co.ke
                        </p>
                        <p className="text-muted-foreground">
                          <strong>Phone:</strong><br />
                          +254 712 345 678
                        </p>
                      </div>
                    </Card>

                    <Card className="p-6 bg-muted">
                      <h3 className="font-bold text-lg mb-2">Event Details</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p><strong>Dates:</strong> April 23-25, 2026</p>
                        <p><strong>Venue:</strong> RUPA Mall Grounds</p>
                        <p><strong>Expected:</strong> 10,000+ visitors</p>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
