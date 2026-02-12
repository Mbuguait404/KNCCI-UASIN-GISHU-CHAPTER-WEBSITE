import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRegistration } from "@/contexts/registration-context";
import { Check, Users, Calendar, Award, Ticket, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  { icon: Users, text: "Network with 500+ business leaders" },
  { icon: Calendar, text: "Access to all 3 days of sessions" },
  { icon: Award, text: "Certificate of attendance" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
  }
};

export function RegistrationSection() {
  const { openRegistration } = useRegistration();

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
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span 
            className="text-primary font-semibold text-sm uppercase tracking-wider"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Secure Your Spot
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6" data-testid="text-registration-title">
            Register Now
          </h2>
          <p className="text-lg text-white/80 leading-relaxed">
            Don't miss this opportunity to be part of Kenya's premier business event. 
            Early registration ensures your place among industry leaders.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
          <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center gap-4" 
                  data-testid={`benefit-${index}`}
                  variants={itemVariants}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-lg text-white/90">{benefit.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.div variants={itemVariants}>
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
            </motion.div>

            <motion.div 
              className="flex flex-wrap gap-4"
              variants={itemVariants}
            >
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
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="p-8 bg-white dark:bg-card border-0 shadow-2xl">
              <div className="text-center space-y-6">
                <motion.div 
                  className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Ticket className="w-10 h-10 text-primary" />
                </motion.div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground">
                    Get Your Tickets
                  </h3>
                  <p className="text-muted-foreground">
                    Select from our range of ticket options including General Admission, 
                    VIP Access, and Corporate Packages.
                  </p>
                </div>

                <div className="space-y-3 text-left bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">Multiple ticket tiers available</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">Secure M-PESA payment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">Instant email confirmation</span>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={openRegistration}
                    size="lg"
                    className="w-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                    data-testid="button-register-ticket"
                  >
                    <span>Register for Event</span>
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </Button>
                </motion.div>

                <p className="text-xs text-muted-foreground text-center">
                  By registering, you agree to receive event-related communications from KNCCI.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
