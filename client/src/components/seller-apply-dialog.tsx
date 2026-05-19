import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  X,
} from "lucide-react";

const STEPS = [
  { id: "business", label: "Business Info" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
];

const NON_MEMBER_FEE = 30000;

interface SellerApplyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SellerApplyDialog({ isOpen, onOpenChange }: SellerApplyDialogProps) {
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

  const resetForm = () => {
    setStep(0);
    setFormData({
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
      paymentMethod: "mpesa",
      transactionReference: "",
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after animation
    setTimeout(resetForm, 300);
  };

  const amountPaid = Number(formData.amountPaid) || 0;
  const balance = Math.max(0, NON_MEMBER_FEE - amountPaid);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="sm:max-w-3xl max-h-[95vh] p-0 overflow-hidden flex flex-col bg-background z-[100]">
        <DialogHeader className="p-6 pb-2 shrink-0 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Store className="w-6 h-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">Become a Marketplace Seller</DialogTitle>
                <DialogDescription className="text-sm">
                  Apply as a non-member seller. Annual subscription fee: KES {NON_MEMBER_FEE.toLocaleString()}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-6">
            {step < 3 && (
              <div className="flex items-center mb-6">
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

            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="business" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Card className="p-6">
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <Label htmlFor="sa-firstName">First Name *</Label>
                        <Input id="sa-firstName" value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="sa-lastName">Last Name *</Label>
                        <Input id="sa-lastName" value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="sa-email">Email *</Label>
                        <Input id="sa-email" type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="sa-phone">Phone</Label>
                        <Input id="sa-phone" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="sa-password">Password *</Label>
                        <Input id="sa-password" type="password" value={formData.password} onChange={(e) => updateField("password", e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="sa-confirmPassword">Confirm Password *</Label>
                        <Input id="sa-confirmPassword" type="password" value={formData.confirmPassword} onChange={(e) => updateField("confirmPassword", e.target.value)} />
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Business Details</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="sa-businessName">Business Name *</Label>
                          <Input id="sa-businessName" value={formData.businessName} onChange={(e) => updateField("businessName", e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="sa-businessCategory">Business Category *</Label>
                          <Input id="sa-businessCategory" value={formData.businessCategory} onChange={(e) => updateField("businessCategory", e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="sa-businessLocation">Location</Label>
                          <Input id="sa-businessLocation" value={formData.businessLocation} onChange={(e) => updateField("businessLocation", e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="sa-businessDescription">Description</Label>
                          <Input id="sa-businessDescription" value={formData.businessDescription} onChange={(e) => updateField("businessDescription", e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="sa-businessPhone">Business Phone</Label>
                          <Input id="sa-businessPhone" value={formData.businessPhone} onChange={(e) => updateField("businessPhone", e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="sa-businessEmail">Business Email</Label>
                          <Input id="sa-businessEmail" type="email" value={formData.businessEmail} onChange={(e) => updateField("businessEmail", e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="sa-kraPin">KRA PIN</Label>
                          <Input id="sa-kraPin" value={formData.kraPin} onChange={(e) => updateField("kraPin", e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="sa-businessRegistrationNo">Company Reg No</Label>
                          <Input id="sa-businessRegistrationNo" value={formData.businessRegistrationNo} onChange={(e) => updateField("businessRegistrationNo", e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button onClick={handleNext}>
                        Continue to Payment <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="payment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Card className="p-6">
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
                        <Label htmlFor="sa-paymentMethod">Payment Method</Label>
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
                        <Label htmlFor="sa-amountPaid">Amount Paid (KES) *</Label>
                        <Input
                          id="sa-amountPaid"
                          type="number"
                          value={formData.amountPaid}
                          onChange={(e) => updateField("amountPaid", e.target.value)}
                          placeholder={`Minimum: ${NON_MEMBER_FEE.toLocaleString()}`}
                        />
                      </div>

                      <div>
                        <Label htmlFor="sa-transactionReference">Transaction Reference *</Label>
                        <Input
                          id="sa-transactionReference"
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

                    <div className="mt-6 flex justify-between">
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
                <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Card className="p-6">
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

                    <div className="mt-6 flex justify-between">
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
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Application Submitted!</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Your seller application has been received. Our team will review your payment and business details. You will be notified via email once approved.
                  </p>
                  <Button onClick={handleClose}>
                    Close Window
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
