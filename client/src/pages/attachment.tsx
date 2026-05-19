import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo/seo-head";
import { attachmentService, SubmitAttachmentData } from "@/services/attachment-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Upload, FileText, X, Loader2, GraduationCap, Building2, Calendar, User, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { id: 1, label: "Personal Info", icon: User },
  { id: 2, label: "Attachment Details", icon: Calendar },
  { id: 3, label: "Documents", icon: Upload },
  { id: 4, label: "Review & Submit", icon: CheckCircle2 },
];

export default function AttachmentPage() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<string[]>([]);
  const [form, setForm] = useState<SubmitAttachmentData>({
    studentName: "",
    studentEmail: "",
    studentPhone: "",
    institution: "",
    course: "",
    attachmentStartDate: "",
    attachmentEndDate: "",
    documents: [],
  });

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const { url } = await attachmentService.uploadDocument(file);
        setDocuments((prev) => [...prev, url]);
      }
      toast({ title: "Documents uploaded successfully" });
    } catch {
      toast({ title: "Upload failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const validateStep = () => {
    if (step === 1) return form.studentName && form.studentEmail && form.studentPhone;
    if (step === 2) return form.institution && form.course && form.attachmentStartDate && form.attachmentEndDate;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = { ...form, documents };
      const res = await attachmentService.submit(payload);
      setSubmittedId(res._id);
      toast({ title: "Application submitted successfully" });
    } catch {
      toast({ title: "Submission failed", description: "Please try again later.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Apply for Attachment | KNCCI Uasin Gishu"
        description="Apply for student attachment opportunities with KNCCI Uasin Gishu Chapter."
      />
      <Navigation />

      <main>
        <section className="bg-gradient-to-br from-primary/10 via-background to-emerald-500/10 border-b border-border/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
            <Badge className="mb-4 rounded-full bg-primary/10 text-primary border-primary/20">Student Opportunities</Badge>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Apply for Attachment Placement</h1>
            <p className="text-muted-foreground mt-3 max-w-2xl">
              Submit your request to be connected with KNCCI member businesses for practical attachment opportunities.
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          {submittedId ? (
            <Card className="rounded-3xl border border-border/60 shadow-lg">
              <CardContent className="py-16 text-center space-y-4">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
                <h2 className="text-2xl font-black">Application Submitted</h2>
                <p className="text-muted-foreground">Thank you. We will review your details and contact you soon.</p>
                <p className="text-sm font-bold">Application ID: <span className="text-primary">{submittedId}</span></p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {steps.map((s) => (
                  <div
                    key={s.id}
                    className={`rounded-2xl border px-3 py-3 flex items-center gap-2 text-xs font-bold ${
                      step >= s.id ? "border-primary/30 bg-primary/5 text-primary" : "border-border/60 text-muted-foreground"
                    }`}
                  >
                    <s.icon className="w-4 h-4" />
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>

              <Card className="rounded-3xl border border-border/60 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-black">{steps[step - 1].label}</CardTitle>
                  <CardDescription>Step {step} of 4</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-5"
                    >
                      {step === 1 && (
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2 md:col-span-2">
                            <Label>Full Name</Label>
                            <Input value={form.studentName} onChange={(e) => setForm((p) => ({ ...p, studentName: e.target.value }))} />
                          </div>
                          <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" value={form.studentEmail} onChange={(e) => setForm((p) => ({ ...p, studentEmail: e.target.value }))} />
                          </div>
                          <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input value={form.studentPhone} onChange={(e) => setForm((p) => ({ ...p, studentPhone: e.target.value }))} />
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Institution</Label>
                            <Input value={form.institution} onChange={(e) => setForm((p) => ({ ...p, institution: e.target.value }))} />
                          </div>
                          <div className="space-y-2">
                            <Label>Course</Label>
                            <Input value={form.course} onChange={(e) => setForm((p) => ({ ...p, course: e.target.value }))} />
                          </div>
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input type="date" value={form.attachmentStartDate} onChange={(e) => setForm((p) => ({ ...p, attachmentStartDate: e.target.value }))} />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input type="date" value={form.attachmentEndDate} onChange={(e) => setForm((p) => ({ ...p, attachmentEndDate: e.target.value }))} />
                          </div>
                        </div>
                      )}

                      {step === 3 && (
                        <div className="space-y-4">
                          <Label>Upload Documents (intro letter, CV, etc.)</Label>
                          <div className="rounded-2xl border border-dashed border-border/70 p-6 text-center">
                            <Input type="file" multiple onChange={(e) => handleUpload(e.target.files)} />
                            <p className="text-xs text-muted-foreground mt-3">Files upload one by one to secure storage.</p>
                          </div>
                          {uploading && (
                            <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
                              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Uploading...
                            </div>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {documents.map((url, i) => (
                              <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold">
                                <FileText className="w-3 h-3" /> Document {i + 1}
                                <button
                                  type="button"
                                  className="ml-1"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setDocuments((prev) => prev.filter((_, idx) => idx !== i));
                                  }}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {step === 4 && (
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div className="rounded-xl border p-3"><span className="text-muted-foreground">Name:</span> {form.studentName}</div>
                            <div className="rounded-xl border p-3"><span className="text-muted-foreground">Email:</span> {form.studentEmail}</div>
                            <div className="rounded-xl border p-3"><span className="text-muted-foreground">Phone:</span> {form.studentPhone}</div>
                            <div className="rounded-xl border p-3"><span className="text-muted-foreground">Institution:</span> {form.institution}</div>
                            <div className="rounded-xl border p-3"><span className="text-muted-foreground">Course:</span> {form.course}</div>
                            <div className="rounded-xl border p-3"><span className="text-muted-foreground">Period:</span> {form.attachmentStartDate} - {form.attachmentEndDate}</div>
                          </div>
                          <div className="rounded-xl border p-3 text-sm">
                            <span className="text-muted-foreground">Documents:</span> {documents.length}
                          </div>
                          <Button className="w-full h-11 rounded-xl font-bold" onClick={handleSubmit} disabled={submitting}>
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <GraduationCap className="w-4 h-4 mr-2" />}
                            Submit Application
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex items-center justify-between mt-8">
                    <Button variant="outline" className="rounded-xl" disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))}>
                      <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                    {step < 4 && (
                      <Button
                        className="rounded-xl"
                        disabled={!validateStep()}
                        onClick={() => setStep((s) => Math.min(4, s + 1))}
                      >
                        Next <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border border-border/60">
                <CardContent className="p-5 text-sm text-muted-foreground flex items-start gap-3">
                  <Building2 className="w-4 h-4 mt-0.5 text-primary" />
                  KNCCI connects students with member businesses for practical exposure and mentorship.
                </CardContent>
              </Card>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
