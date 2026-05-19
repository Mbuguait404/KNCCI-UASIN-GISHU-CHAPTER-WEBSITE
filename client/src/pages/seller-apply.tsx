import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import {
  Store,
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Smartphone,
  Building2,
  Receipt,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Link } from "wouter";

const STEPS = [
  { id: "business", label: "Business Info" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
];

const NON_MEMBER_FEE = 30000;

export default function SellerApplyPage() {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    businessCategory: "",
    businessDescription: "",
    businessLocation: "",
    businessPhone: "",
    businessEmail: "",
    kraPin: "",
    businessRegistrationNo: "",
    amountPaid: "",
    paymentMethod: "mpesa" as "mpesa" | "bank" | "cash" | "other",
    transactionReference: "",
  });

  const updateField = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 0) {
      // Validate business info
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        toast({ title: "Required Fields", description: "Please fill in all required personal fields.", variant: "destructive" });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" });
        return;
      }
      if (!formData.businessName || !formData.businessCategory) {
        toast({ title: "Required Fields", description: "Business name and category are required.", variant: "destructive" });
        return;
      }
    }
    if (step === 1) {
      const amount = Number(formData.amountPaid);
      if (!amount || amount <= 0) {
        toast({ title: "Payment Required", description: "Please enter the amount paid.", variant: "destructive" });
        return;
      }
      if (!formData.transactionReference) {
        toast({ title: "Reference Required", description: "Please provide a transaction reference.", variant: "destructive" });
        return;
      }
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        amountPaid: Number(formData.amountPaid),
        subscriptionFee: NON_MEMBER_FEE,
      };
      const res = await api.post("/seller/auth/register", payload);
      const data = res.data;
      toast({ title: "Application Submitted", description: data.message || data.data?.message || "Your seller application has been submitted for review." });
      setStep(3); // Success state
    } catch (err: any) {
      const message = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to submit application. Please try again.";
      toast({ title: "Submission Failed", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const amountPaid = Number(formData.amountPaid) || 0;
  const balance = Math.max(0, NON_MEMBER_FEE - amountPaid);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Become a Marketplace Seller
          </h1>
          <p className="text-muted-foreground">
            Apply as a non-member seller. Annual subscription fee: <strong>KES {NON_MEMBER_FEE.toLocaleString()}</strong>
          </p>
        </motion.div>

        {/* Stepper */}
        {step < 3 && (
          <div className="flex items-center mb-8">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    i <= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-slate-200 dark:bg-slate-700 text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span
                  className={`ml-2 text-sm font-medium hidden sm:block ${
                    i <= step ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded ${
                      i < step ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        {step === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Business Information</h2>
                  <p className="text-sm text-muted-foreground">Tell us about yourself and your business</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input id="password" type="password" value={formData.password} onChange={(e) => updateField("password", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={(e) => updateField("confirmPassword", e.target.value)} />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Business Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input id="businessName" value={formData.businessName} onChange={(e) => updateField("businessName", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="businessCategory">Business Category *</Label>
                    <Input id="businessCategory" value={formData.businessCategory} onChange={(e) => updateField("businessCategory", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="businessLocation">Location</Label>
                    <Input id="businessLocation" value={formData.businessLocation} onChange={(e) => updateField("businessLocation", e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="businessDescription">Description</Label>
                    <Input id="businessDescription" value={formData.businessDescription} onChange={(e) => updateField("businessDescription", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="businessPhone">Business Phone</Label>
                    <Input id="businessPhone" value={formData.businessPhone} onChange={(e) => updateField("businessPhone", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="businessEmail">Business Email</Label>
                    <Input id="businessEmail" type="email" value={formData.businessEmail} onChange={(e) => updateField("businessEmail", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="kraPin">KRA PIN</Label>
                    <Input id="kraPin" value={formData.kraPin} onChange={(e) => updateField("kraPin", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="businessRegistrationNo">Company Reg No</Label>
                    <Input id="businessRegistrationNo" value={formData.businessRegistrationNo} onChange={(e) => updateField("businessRegistrationNo", e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button onClick={handleNext}>
                  Continue to Payment <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Payment</h2>
                  <p className="text-sm text-muted-foreground">Complete your subscription payment</p>
                </div>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Subscription Fee</span>
                  <span className="font-bold text-foreground">KES {NON_MEMBER_FEE.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Amount Paid</span>
                  <span className="font-bold text-primary">KES {amountPaid.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Balance</span>
                  <span className={`font-bold ${balance > 0 ? "text-orange-500" : "text-green-500"}`}>
                    KES {balance.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                    {[
                      { value: "mpesa", label: "M-Pesa", icon: Smartphone },
                      { value: "bank", label: "Bank", icon: Building2 },
                      { value: "cash", label: "Cash", icon: CreditCard },
                      { value: "other", label: "Other", icon: Receipt },
                    ].map((method) => (
                      <button
                        key={method.value}
                        onClick={() => updateField("paymentMethod", method.value)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                          formData.paymentMethod === method.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-slate-200 dark:border-slate-700 hover:border-primary/50"
                        }`}
                      >
                        <method.icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="amountPaid">Amount Paid (KES) *</Label>
                  <Input
                    id="amountPaid"
                    type="number"
                    value={formData.amountPaid}
                    onChange={(e) => updateField("amountPaid", e.target.value)}
                    placeholder={`Minimum: ${NON_MEMBER_FEE.toLocaleString()}`}
                  />
                </div>

                <div>
                  <Label htmlFor="transactionReference">Transaction Reference *</Label>
                  <Input
                    id="transactionReference"
                    value={formData.transactionReference}
                    onChange={(e) => updateField("transactionReference", e.target.value)}
                    placeholder="e.g. MPESA123456 or Bank Ref #"
                  />
                </div>

                {balance > 0 && (
                  <div className="flex items-start gap-2 text-orange-600 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      You have a remaining balance of KES {balance.toLocaleString()}. Your application will be marked as partial payment. Please complete the full payment before approval.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={handleNext}>
                  Review Application <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Review & Submit</h2>
                  <p className="text-sm text-muted-foreground">Confirm your details before submitting</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Personal Info</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Name:</div>
                    <div className="text-foreground font-medium">{formData.firstName} {formData.lastName}</div>
                    <div className="text-muted-foreground">Email:</div>
                    <div className="text-foreground font-medium">{formData.email}</div>
                    <div className="text-muted-foreground">Phone:</div>
                    <div className="text-foreground font-medium">{formData.phone || "N/A"}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Business Info</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Business Name:</div>
                    <div className="text-foreground font-medium">{formData.businessName}</div>
                    <div className="text-muted-foreground">Category:</div>
                    <div className="text-foreground font-medium">{formData.businessCategory}</div>
                    <div className="text-muted-foreground">Location:</div>
                    <div className="text-foreground font-medium">{formData.businessLocation || "N/A"}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Payment</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Amount Paid:</div>
                    <div className="text-foreground font-medium">KES {amountPaid.toLocaleString()}</div>
                    <div className="text-muted-foreground">Payment Method:</div>
                    <div className="text-foreground font-medium capitalize">{formData.paymentMethod}</div>
                    <div className="text-muted-foreground">Reference:</div>
                    <div className="text-foreground font-medium">{formData.transactionReference}</div>
                    <div className="text-muted-foreground">Balance:</div>
                    <div className={`font-medium ${balance > 0 ? "text-orange-500" : "text-green-500"}`}>
                      KES {balance.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application <Check className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Application Submitted!
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Your seller application has been received. Our team will review your payment and business details. You will be notified via email once approved.
              </p>
              <div className="flex justify-center gap-3">
                <Link href="/">
                  <Button variant="outline">Return Home</Button>
                </Link>
                <Link href="/marketplace">
                  <Button>Browse Marketplace</Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
