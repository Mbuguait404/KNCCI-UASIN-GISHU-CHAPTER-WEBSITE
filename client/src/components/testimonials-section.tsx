import { staticTestimonials } from "@/data/static-data";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";

export function TestimonialsSection() {
  const testimonials = staticTestimonials;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <section
      id="testimonials"
      className="py-24 bg-gradient-to-b from-background to-slate-50 dark:to-slate-900/20 relative overflow-hidden"
      data-testid="section-testimonials"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            Member Success Stories
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-foreground mb-6"
            data-testid="text-testimonials-title"
          >
            The Voice of Our <span className="text-primary">Members</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            Discover how KNCCI Uasin Gishu Chapter has been a catalyst for growth,
            innovation, and success for businesses across the region.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={testimonial.id} variants={itemVariants} className="h-full">
              <Card className="h-full p-8 flex flex-col border-border/50 bg-card hover:shadow-2xl hover:border-primary/20 transition-all duration-500 relative group overflow-hidden">
                {/* Decorative Quote Icon in background */}
                <Quote className="absolute -top-4 -right-4 w-24 h-24 text-primary/5 group-hover:text-primary/10 transition-colors rotate-12" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                    ))}
                  </div>

                  <blockquote className="text-foreground leading-relaxed mb-8 italic flex-grow">
                    "{testimonial.quote}"
                  </blockquote>

                  <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border/50">
                    <Avatar className="w-12 h-12 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary-foreground text-white font-bold opacity-90 text-sm">
                        {testimonial.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="font-bold text-foreground truncate" data-testid="text-testimonial-name">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-0.5 truncate" data-testid="text-testimonial-title">
                        {testimonial.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate" data-testid="text-testimonial-org">
                        {testimonial.organization}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <p className="text-muted-foreground mb-4">Are you a member with a success story to share?</p>
          <a h-12 href="/contact" className="text-primary font-bold hover:underline inline-flex items-center gap-2">
            Contact us and let your voice be heard
          </a>
        </motion.div>
      </div>
    </section>
  );
}

