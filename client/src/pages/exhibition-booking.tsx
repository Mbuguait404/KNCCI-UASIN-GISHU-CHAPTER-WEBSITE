import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { MemberSearch, type Member } from "@/components/member-search";
import { ArrowLeft, Building2, Users, Check, Lock, Tag } from "lucide-react";
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
    memberName: "",
    memberEmail: "",
    isMember: false,
    pricePerBooth: 40000,
    selectedMember: null as Member | null,
  });

  const [registrationMode, setRegistrationMode] = useState<"member" | "non-member" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registrationMode === null) {
      toast({
        title: "Registration Type Required",
        description: "Please select whether you are a KNCCI member or not.",
        variant: "destructive",
      });
      return;
    }

    if (registrationMode === "member" && formData.selectedMember === null) {
      toast({
        title: "Member Verification Required",
        description: "Please search and select your name from the member list.",
        variant: "destructive",
      });
      return;
    }

    if (registrationMode === "non-member" && formData.email === "") {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const submissionData = {
      companyName: formData.companyName,
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      isMember: formData.isMember,
      memberName: formData.memberName,
      memberEmail: formData.memberEmail,
      pricePerBooth: formData.pricePerBooth,
      boothCount: formData.boothCount,
      additionalRequirements: formData.additionalRequirements,
      totalAmount: formData.boothCount === "4+" ? "Contact for pricing" : formData.pricePerBooth * parseInt(formData.boothCount),
    };

    console.log("Exhibition booking submitted:", submissionData);

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

  const handleMemberChange = (member: Member | null, isMember: boolean) => {
    const pricePerBooth = isMember ? 30000 : 40000;
    setFormData(prev => ({
      ...prev,
      selectedMember: member,
      isMember,
      pricePerBooth,
      memberName: member?.name || "",
      memberEmail: member?.email || "",
      email: member?.email || prev.email,
    }));
  };

  const handleSelectMemberMode = () => {
    setRegistrationMode("member");
    setFormData(prev => ({
      ...prev,
      isMember: false,
      pricePerBooth: 30000,
      selectedMember: null,
      memberName: "",
      memberEmail: "",
    }));
  };

  const handleSelectNonMemberMode = () => {
    setRegistrationMode("non-member");
    setFormData(prev => ({
      ...prev,
      isMember: false,
      pricePerBooth: 40000,
      selectedMember: null,
      memberName: "",
      memberEmail: "",
      email: "",
    }));
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
                <div className="bg-muted p-4 rounded-lg mb-6 text-left space-y-3">
                  <div className="border-b border-border pb-3">
                    <p className="text-sm font-medium text-foreground mb-2">Booking Summary:</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rate Type:</span>
                      <span className={formData.isMember ? "text-green-700 font-medium" : "text-amber-700 font-medium"}>
                        {formData.isMember ? "KNCCI Member" : "Non-Member"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price per Booth:</span>
                      <span className="font-medium">KES {formData.pricePerBooth.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Number of Booths:</span>
                      <span className="font-medium">{formData.boothCount}</span>
                    </div>
                    {formData.boothCount !== "4+" && (
                      <div className="flex justify-between text-sm border-t border-border pt-2 mt-2">
                        <span className="text-muted-foreground font-medium">Total Amount:</span>
                        <span className="font-bold text-primary">KES {(formData.pricePerBooth * parseInt(formData.boothCount)).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>What happens next?</strong>
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• We will review your application</li>
                    <li>• You will receive a confirmation email at {formData.email}</li>
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
                          </div>
                        </div>

                        <div className="border-t border-border pt-6">
                          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Exhibition Details
                          </h2>
                          
                          <div className="space-y-4">
                            {/* Registration Mode Selection */}
                            {registrationMode === null && (
                              <div className="bg-muted/30 border border-border rounded-lg p-6">
                                <h3 className="text-lg font-medium mb-4 text-center">Select Registration Type</h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                  <button
                                    type="button"
                                    onClick={handleSelectMemberMode}
                                    className="flex flex-col items-center justify-center gap-3 p-6 bg-background border-2 border-primary/20 hover:border-primary rounded-lg transition-all hover:shadow-md"
                                  >
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                      <Users className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="text-center">
                                      <div className="font-semibold text-foreground">I am a KNCCI Member</div>
                                      <div className="text-sm text-muted-foreground mt-1">KES 30,000 per booth</div>
                                    </div>
                                  </button>
                                  
                                  <button
                                    type="button"
                                    onClick={handleSelectNonMemberMode}
                                    className="flex flex-col items-center justify-center gap-3 p-6 bg-background border-2 border-muted hover:border-muted-foreground/50 rounded-lg transition-all hover:shadow-md"
                                  >
                                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                                      <Users className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div className="text-center">
                                      <div className="font-semibold text-foreground">I am not a member</div>
                                      <div className="text-sm text-muted-foreground mt-1">KES 40,000 per booth</div>
                                    </div>
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Member Search - Only shown when member mode selected */}
                            {registrationMode === "member" && (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium">Member Verification</h3>
                                  <button
                                    type="button"
                                    onClick={() => setRegistrationMode(null)}
                                    className="text-sm text-primary hover:underline"
                                  >
                                    Change registration type
                                  </button>
                                </div>
                                <MemberSearch
                                  value={formData.selectedMember}
                                  onChange={handleMemberChange}
                                  disabled={isSubmitting}
                                />
                              </div>
                            )}

                            {/* Non-Member Notice - Only shown when non-member mode selected */}
                            {registrationMode === "non-member" && (
                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-amber-600" />
                                    <span className="font-medium text-amber-800">Non-Member Registration</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setRegistrationMode(null)}
                                    className="text-sm text-amber-700 hover:underline"
                                  >
                                    Change registration type
                                  </button>
                                </div>
                                <p className="text-sm text-amber-700">
                                  You are registering as a non-member. The rate is KES 40,000 per booth.
                                  Consider becoming a KNCCI member for discounted rates on future events.
                                </p>
                              </div>
                            )}

                            {((registrationMode === "member" && formData.selectedMember !== null) || registrationMode === "non-member") && (
                              <div className="bg-muted/50 border rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label htmlFor="email" className="flex items-center gap-2">
                                    Email Address
                                    {formData.isMember && <Lock className="h-3 w-3 text-muted-foreground" />}
                                  </Label>
                                  {formData.isMember && (
                                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                      Auto-filled
                                    </Badge>
                                  )}
                                </div>
                                <Input
                                  id="email"
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) => handleChange("email", e.target.value)}
                                  placeholder="company@example.com"
                                  disabled={formData.isMember}
                                  required
                                />
                                {formData.isMember && (
                                  <p className="text-xs text-muted-foreground">
                                    Email auto-populated from member record
                                  </p>
                                )}
                              </div>
                            )}

                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <Label className="flex items-center gap-2">
                                  <Tag className="h-4 w-4 text-primary" />
                                  Price Per Booth
                                </Label>
                                <Badge 
                                  className={formData.isMember 
                                    ? "bg-green-100 text-green-700 border-green-300" 
                                    : "bg-amber-100 text-amber-700 border-amber-300"
                                  }
                                >
                                  {formData.isMember ? "Member Rate" : "Non-Member Rate"}
                                </Badge>
                              </div>
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-foreground">
                                  KES {formData.pricePerBooth.toLocaleString()}
                                </span>
                                <span className="text-sm text-muted-foreground">/booth</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                {formData.isMember 
                                  ? "You are receiving the KNCCI member discount of KES 10,000 off the standard rate."
                                  : "Standard non-member rate applies. Become a KNCCI member to save KES 10,000 per booth."
                                }
                              </p>
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

                        {formData.selectedMember === null && !formData.isMember && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                            <p className="font-medium">Member Verification Required</p>
                            <p className="text-xs text-amber-700 mt-1">
                              Please search for your KNCCI membership or select &quot;Not a Member&quot; to continue.
                            </p>
                          </div>
                        )}

                        <Button 
                          type="submit" 
                          className="w-full bg-primary text-primary-foreground py-6 text-lg"
                          disabled={isSubmitting || !formData.agreeTerms || (formData.selectedMember === null && !formData.isMember)}
                        >
                          {isSubmitting ? "Submitting..." : `Submit Request${formData.boothCount !== "4+" ? ` (KES ${(formData.pricePerBooth * parseInt(formData.boothCount)).toLocaleString()})` : ""}`}
                        </Button>
                      </form>
                    </Card>
                  </div>

                  {/* Sidebar Info */}
                  <div className="space-y-6">
                    <Card className="p-6 bg-primary/5 border-primary/20">
                      <h3 className="font-bold text-lg mb-4 text-primary">Pricing Summary</h3>
                      <div className="space-y-3 text-sm">
                        <div className="bg-background border rounded-lg p-3 mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-muted-foreground">Your Rate:</span>
                            <Badge 
                              className={formData.isMember 
                                ? "bg-green-100 text-green-700 border-green-300" 
                                : "bg-amber-100 text-amber-700 border-amber-300"
                              }
                            >
                              {formData.isMember ? "Member" : "Non-Member"}
                            </Badge>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-foreground">
                              KES {formData.pricePerBooth.toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground">/booth</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Member Rate:</span>
                            <span className={formData.isMember ? "font-semibold text-green-700" : "text-muted-foreground"}>
                              KES 30,000
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Non-Member Rate:</span>
                            <span className={!formData.isMember ? "font-semibold text-amber-700" : "text-muted-foreground"}>
                              KES 40,000
                            </span>
                          </div>
                        </div>

                        {formData.boothCount !== "4+" && (
                          <div className="border-t border-border pt-3 mt-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Estimated Total:</span>
                              <span className="text-lg font-bold text-primary">
                                KES {(formData.pricePerBooth * parseInt(formData.boothCount)).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formData.boothCount} booth{parseInt(formData.boothCount) > 1 ? 's' : ''} × KES {formData.pricePerBooth.toLocaleString()}
                            </p>
                          </div>
                        )}

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
