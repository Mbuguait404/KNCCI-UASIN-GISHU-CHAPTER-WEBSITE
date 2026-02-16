import { useState, useEffect } from "react";
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
import { ArrowLeft, Building2, Users, Check, Lock, CreditCard, Smartphone, Copy, CheckCircle2, UserPlus } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/seo/seo-head";
import { RegistrationDialog } from "@/components/registration-dialog";
import { useRegistration } from "@/contexts/registration-context";
import { staticEvent } from "@/data/static-data";
import { submitToWeb3Forms, formatFormDataForEmail } from "@/lib/web3forms";

export default function ExhibitionBookingPage() {
  const { toast } = useToast();
  const { isOpen, closeRegistration } = useRegistration();
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

    // Validate required fields for non-members
    if (registrationMode === "non-member") {
      if (!formData.companyName.trim()) {
        toast({
          title: "Company Name Required",
          description: "Please enter your company name.",
          variant: "destructive",
        });
        return;
      }
      if (!formData.contactPerson.trim()) {
        toast({
          title: "Contact Person Required",
          description: "Please enter the contact person's name.",
          variant: "destructive",
        });
        return;
      }
      if (!formData.phone.trim()) {
        toast({
          title: "Phone Number Required",
          description: "Please enter your phone number.",
          variant: "destructive",
        });
        return;
      }
    }

    // Validate required fields for members
    if (registrationMode === "member") {
      if (!formData.companyName.trim()) {
        toast({
          title: "Company Name Required",
          description: "Please enter your company name.",
          variant: "destructive",
        });
        return;
      }
      if (!formData.contactPerson.trim() && !formData.selectedMember) {
        toast({
          title: "Contact Person Required",
          description: "Please enter the contact person's name or select a member.",
          variant: "destructive",
        });
        return;
      }
      if (!formData.phone.trim()) {
        toast({
          title: "Phone Number Required",
          description: "Please enter your phone number.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const totalAmount = formData.boothCount === "4+" 
        ? "Contact for pricing" 
        : formData.pricePerBooth * parseInt(formData.boothCount);

      // Use member name as contact person if member, otherwise use entered contact person
      const contactPersonName = formData.isMember && formData.memberName 
        ? formData.memberName 
        : formData.contactPerson;

      // Get booth type details
      const getBoothDetails = (boothCount: string) => {
        const boothMap: Record<string, { type: string; dimensions: string; totalSqm: number }> = {
          "1": { type: "1 Booth", dimensions: "3x3 meters", totalSqm: 9 },
          "2": { type: "2 Booths", dimensions: "6x3 meters", totalSqm: 18 },
          "3": { type: "3 Booths", dimensions: "9x3 meters", totalSqm: 27 },
          "4+": { type: "4+ Booths", dimensions: "Contact for dimensions", totalSqm: 0 },
        };
        return boothMap[boothCount] || { type: boothCount, dimensions: "N/A", totalSqm: 0 };
      };

      const boothDetails = getBoothDetails(formData.boothCount);
      const boothTypeDescription = formData.boothCount === "4+" 
        ? "4+ Booths (Contact for pricing)" 
        : `${boothDetails.type} (${boothDetails.dimensions})`;

      const submissionData = {
        name: contactPersonName,
        email: formData.email,
        phone: formData.phone,
        company_name: formData.companyName,
        contact_person: contactPersonName,
        member_type: formData.isMember ? "KNCCI Member" : "Non-Member",
        member_name: formData.memberName || "N/A",
        member_email: formData.memberEmail || "N/A",
        price_per_booth: `KES ${formData.pricePerBooth.toLocaleString()}`,
        booth_count: formData.boothCount,
        booth_type: boothDetails.type,
        booth_dimensions: boothDetails.dimensions,
        booth_total_sqm: boothDetails.totalSqm > 0 ? `${boothDetails.totalSqm} sqm` : "N/A",
        booth_description: boothTypeDescription,
        total_amount: typeof totalAmount === "number" 
          ? `KES ${totalAmount.toLocaleString()}` 
          : totalAmount,
        additional_requirements: formData.additionalRequirements || "None",
      };

      // Submit to Web3Forms
      const result = await submitToWeb3Forms(
        {
          ...submissionData,
          message: formatFormDataForEmail(submissionData),
        },
        `Exhibition Booking Request - ${formData.companyName}`
      );

      if (result.success) {
        setIsSubmitting(false);
        setIsSubmitted(true);
        
        toast({
          title: "Request Submitted Successfully!",
          description: "We will contact you within 24 hours to confirm your exhibition space.",
        });
      } else {
        throw new Error(result.message || "Failed to submit form");
      }
    } catch (error) {
      console.error("Exhibition booking submission error:", error);
      setIsSubmitting(false);
      
      toast({
        title: "Submission Failed",
        description: error instanceof Error 
          ? error.message 
          : "Failed to submit your request. Please try again or contact us directly.",
        variant: "destructive",
      });
    }
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
      // Auto-populate contact person from member name
      contactPerson: member?.name || prev.contactPerson,
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
              <Card className="p-8 sm:p-10 text-center shadow-lg border-2 border-primary/10">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  Exhibition Space Request Submitted!
                </h1>
                <p className="text-slate-700 dark:text-slate-300 mb-8 text-base leading-relaxed max-w-xl mx-auto">
                  Thank you for your interest in exhibiting at the Eldoret International Business Summit 2026. 
                  Our team will review your request and contact you within 24 hours to confirm your booking 
                  and provide payment details.
                </p>
                <div className="bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-700 p-6 rounded-lg mb-6 text-left space-y-4 shadow-sm">
                  <div className="border-b border-slate-300 dark:border-slate-600 pb-4">
                    <p className="text-base font-semibold text-foreground mb-4">Booking Summary:</p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Rate Type:</span>
                        <span className={formData.isMember ? "text-green-700 dark:text-green-400 font-semibold" : "text-amber-700 dark:text-amber-400 font-semibold"}>
                          {formData.isMember ? "KNCCI Member" : "Non-Member"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Price per Booth:</span>
                        <span className="text-foreground font-semibold">KES {formData.pricePerBooth.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Number of Booths:</span>
                        <span className="text-foreground font-semibold">{formData.boothCount}</span>
                      </div>
                      {formData.boothCount !== "4+" && (
                        <div className="flex justify-between items-center text-sm border-t-2 border-slate-300 dark:border-slate-600 pt-3 mt-3">
                          <span className="text-slate-800 dark:text-slate-200 font-semibold">Total Amount:</span>
                          <span className="font-bold text-primary text-base">KES {(formData.pricePerBooth * parseInt(formData.boothCount)).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-base font-semibold text-foreground mb-3">
                      What happens next?
                    </p>
                    <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>We will review your application</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>You will receive a confirmation email at <span className="font-medium text-foreground">{formData.email}</span></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Payment instructions will be provided</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Booth assignment details</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20 p-6 rounded-lg mb-6 text-left">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-lg text-primary">Payment Information</h3>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                    Please make payment using one of the methods below. Include your company name as the payment reference.
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* M-Pesa Paybill */}
                    <div className="bg-background border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Smartphone className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-semibold text-foreground">M-Pesa Paybill</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-600 dark:text-slate-400">Paybill Number:</span>
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono font-bold text-foreground bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">7056475</code>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText("7056475");
                                toast({ title: "Copied!", description: "Paybill number copied to clipboard" });
                              }}
                              className="text-primary hover:text-primary/80 transition-colors"
                              title="Copy paybill number"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                          M-Pesa → Pay Bill → <strong>7056475</strong> → Account: <strong>Your Company Name</strong>
                        </p>
                      </div>
                    </div>

                    {/* Bank Transfer */}
                    <div className="bg-background border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-semibold text-foreground">Bank Transfer</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-600 dark:text-slate-400">Bank:</span>
                          <span className="text-sm font-semibold text-foreground">KCB Bank</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-600 dark:text-slate-400">Account Number:</span>
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono font-bold text-foreground bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">1181182263</code>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText("1181182263");
                                toast({ title: "Copied!", description: "Account number copied to clipboard" });
                              }}
                              className="text-primary hover:text-primary/80 transition-colors"
                              title="Copy account number"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                          Transfer to KCB Account: <strong>1181182263</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-300 dark:border-slate-600">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        Payment confirmation will be sent via email within 24 hours after we receive your payment.
                      </p>
                    </div>
                  </div>
                </div>

                <Link href="/">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all px-6 py-6 text-base font-semibold">
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
                      <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Step 1: Registration Type - Always first */}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                            <h2 className="text-base font-medium text-foreground">How are you registering?</h2>
                          </div>
                          {registrationMode === null ? (
                            <div className="grid sm:grid-cols-2 gap-4">
                              <button
                                type="button"
                                onClick={handleSelectMemberMode}
                                className="flex flex-col items-center justify-center gap-3 p-6 bg-muted/30 border-2 border-primary/30 hover:border-primary rounded-xl transition-all hover:shadow-md"
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
                                className="flex flex-col items-center justify-center gap-3 p-6 bg-muted/30 border-2 border-border hover:border-muted-foreground/50 rounded-xl transition-all hover:shadow-md"
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
                          ) : (
                            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                              <span className="font-medium text-foreground">
                                {registrationMode === "member" ? "KNCCI Member" : "Non-Member"} — KES {formData.pricePerBooth.toLocaleString()}/booth
                              </span>
                              <button
                                type="button"
                                onClick={() => setRegistrationMode(null)}
                                className="text-sm text-primary hover:underline"
                              >
                                Change
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Step 2: Your Information - Shown when registration type selected */}
                        {registrationMode !== null && (
                          <div>
                            <div className="flex items-center gap-2 mb-4">
                              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                              <h2 className="text-base font-medium text-foreground flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" />
                                Your Information
                              </h2>
                            </div>

                            {/* Member Search - Only when member mode */}
                            {registrationMode === "member" && (
                              <div className="space-y-3 mb-5">
                                <Label className="text-sm font-medium">Member Verification</Label>
                                <MemberSearch
                                  value={formData.selectedMember}
                                  onChange={handleMemberChange}
                                  disabled={isSubmitting}
                                />
                              </div>
                            )}

                            {/* Non-Member compact notice */}
                            {registrationMode === "non-member" && (
                              <div className="flex items-center justify-between gap-4 p-3 mb-5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                                <p className="text-sm text-amber-800 dark:text-amber-200">
                                  Non-member rate applies. <Link href="/membership" className="text-primary hover:underline font-medium">Become a KNCCI member</Link> to save KES 10,000 per booth.
                                </p>
                              </div>
                            )}

                            {/* Company & Contact fields - shown when (member + selected) OR non-member */}
                            {((registrationMode === "member" && formData.selectedMember !== null) || registrationMode === "non-member") && (
                              <div className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="companyName">Company Name *</Label>
                                    <Input
                                      id="companyName"
                                      value={formData.companyName}
                                      onChange={(e) => handleChange("companyName", e.target.value)}
                                      placeholder="Enter your company name"
                                      className="w-full"
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="contactPerson" className="flex items-center gap-2">
                                      Contact Person *
                                      {formData.isMember && formData.selectedMember && (
                                        <Badge variant="outline" className="text-xs">Auto-filled</Badge>
                                      )}
                                    </Label>
                                    <Input
                                      id="contactPerson"
                                      value={formData.contactPerson}
                                      onChange={(e) => handleChange("contactPerson", e.target.value)}
                                      placeholder={formData.isMember ? "From member record" : "Full name"}
                                      disabled={formData.isMember && !!formData.selectedMember}
                                      className="w-full"
                                      required={!formData.isMember || !formData.selectedMember}
                                    />
                                  </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <Input
                                      id="phone"
                                      type="tel"
                                      value={formData.phone}
                                      onChange={(e) => handleChange("phone", e.target.value)}
                                      placeholder="+254 XXX XXX XXX"
                                      className="w-full"
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                      Email Address *
                                      {formData.isMember && <Lock className="h-3 w-3 text-muted-foreground" />}
                                    </Label>
                                    <Input
                                      id="email"
                                      type="email"
                                      value={formData.email}
                                      onChange={(e) => handleChange("email", e.target.value)}
                                      placeholder="company@example.com"
                                      disabled={formData.isMember}
                                      className="w-full"
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Step 3: Exhibition Details - Shown when ready */}
                        {((registrationMode === "member" && formData.selectedMember !== null) || registrationMode === "non-member") && (
                          <div>
                            <div className="flex items-center gap-2 mb-4">
                              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
                              <h2 className="text-base font-medium text-foreground flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Exhibition Details
                              </h2>
                            </div>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="boothCount">Number of Booths *</Label>
                                <Select 
                                  value={formData.boothCount} 
                                  onValueChange={(value) => handleChange("boothCount", value)}
                                >
                                  <SelectTrigger className="w-full">
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
                              <div className="space-y-2">
                                <Label htmlFor="additionalRequirements">Additional Requirements</Label>
                                <Textarea
                                  id="additionalRequirements"
                                  value={formData.additionalRequirements}
                                  onChange={(e) => handleChange("additionalRequirements", e.target.value)}
                                  placeholder="Any special requirements, equipment needs, or questions..."
                                  rows={3}
                                  className="w-full"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Terms & Submit */}
                        <div className="border-t border-border pt-6 space-y-6">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              id="terms"
                              checked={formData.agreeTerms}
                              onCheckedChange={(checked) => handleChange("agreeTerms", checked as boolean)}
                              required
                            />
                            <Label htmlFor="terms" className="text-sm font-normal leading-relaxed cursor-pointer">
                              I agree to the terms and conditions. I understand that submission of this form does not guarantee space allocation until payment is confirmed. *
                            </Label>
                          </div>

                          {registrationMode === null && (
                            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm text-amber-800 dark:text-amber-200">
                              Please select your registration type above to continue.
                            </div>
                          )}

                          {registrationMode === "member" && formData.selectedMember === null && (
                            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200">
                              Please search and select your name from the member list to continue.
                            </div>
                          )}

                          <Button 
                            type="submit" 
                            className="w-full bg-primary text-primary-foreground py-6 text-lg"
                            disabled={
                              isSubmitting || 
                              !formData.agreeTerms || 
                              registrationMode === null ||
                              (registrationMode === "member" && formData.selectedMember === null) ||
                              (registrationMode === "non-member" && !formData.email.trim())
                            }
                          >
                            {isSubmitting ? "Submitting..." : `Submit Request${formData.boothCount !== "4+" ? ` (KES ${(formData.pricePerBooth * parseInt(formData.boothCount)).toLocaleString()})` : ""}`}
                          </Button>
                        </div>
                      </form>
                    </Card>
                  </div>

                  {/* Sidebar Info */}
                  <div className="space-y-6 lg:sticky lg:top-24">
                    <Card className="p-6 bg-primary/5 border-primary/20">
                      <h3 className="font-bold text-lg mb-4 text-primary">Pricing Summary</h3>
                      <div className="space-y-3 text-sm">
                        <div className="bg-background border rounded-lg p-3 mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-muted-foreground">Your Rate:</span>
                            {registrationMode ? (
                              <Badge 
                                className={registrationMode === "member" 
                                  ? "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700" 
                                  : "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700"
                                }
                              >
                                {registrationMode === "member" ? "Member" : "Non-Member"}
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">Select type</span>
                            )}
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

                    {/* KNCCI Membership CTA - especially relevant for non-members */}
                    <Card className={`p-6 border-2 ${registrationMode === "non-member" ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" : "bg-muted/50 border-border"}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <UserPlus className={`h-5 w-5 ${registrationMode === "non-member" ? "text-green-600" : "text-primary"}`} />
                        <h3 className={`font-bold text-lg ${registrationMode === "non-member" ? "text-green-800 dark:text-green-200" : "text-foreground"}`}>
                          {registrationMode === "member" ? "KNCCI Member Benefits" : "Save KES 10,000 per Booth"}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {registrationMode === "member"
                          ? "You're enjoying member rates. Thank you for being part of KNCCI!"
                          : "Become a KNCCI member to get the discounted rate of KES 30,000 per booth—that's KES 10,000 in savings."}
                      </p>
                      {registrationMode === "non-member" && (
                        <Link href="/membership">
                          <Button
                            size="sm"
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Become a KNCCI Member
                          </Button>
                        </Link>
                      )}
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
                      <div className="flex items-center gap-2 mb-4">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <h3 className="font-bold text-lg text-primary">Payment Information</h3>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">
                        After submitting your request, please make payment using one of the methods below:
                      </p>
                      
                      <div className="space-y-4">
                        {/* M-Pesa Paybill */}
                        <div className="bg-background border border-border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Smartphone className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-semibold text-foreground">M-Pesa Paybill</span>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Paybill Number:</span>
                              <div className="flex items-center gap-2">
                                <code className="text-sm font-mono font-bold text-foreground bg-muted px-2 py-1 rounded">7056475</code>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText("7056475");
                                    toast({ title: "Copied!", description: "Paybill number copied to clipboard" });
                                  }}
                                  className="text-primary hover:text-primary/80 transition-colors"
                                  title="Copy paybill number"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              Go to M-Pesa → Pay Bill → Enter <strong>7056475</strong> → Enter Account Number: <strong>Your Company Name</strong>
                            </p>
                          </div>
                        </div>

                        {/* Bank Transfer */}
                        <div className="bg-background border border-border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-semibold text-foreground">Bank Transfer</span>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Bank:</span>
                              <span className="text-sm font-semibold text-foreground">KCB Bank</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Account Number:</span>
                              <div className="flex items-center gap-2">
                                <code className="text-sm font-mono font-bold text-foreground bg-muted px-2 py-1 rounded">1181182263</code>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText("1181182263");
                                    toast({ title: "Copied!", description: "Account number copied to clipboard" });
                                  }}
                                  className="text-primary hover:text-primary/80 transition-colors"
                                  title="Copy account number"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              Transfer to KCB Bank Account: <strong>1181182263</strong>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-muted-foreground">
                            <strong className="text-foreground">Note:</strong> Include your company name as the payment reference. 
                            Payment confirmation will be sent via email within 24 hours.
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
        
        <RegistrationDialog
          isOpen={isOpen}
          onOpenChange={closeRegistration}
          event={staticEvent}
        />
      </div>
    </>
  );
}
