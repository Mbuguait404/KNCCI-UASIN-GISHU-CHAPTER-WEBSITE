import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const sponsors = [
  { name: "AAR Insurance", logo: "/sponsors/aar-insurance.png" },
  { name: "ASL Tours & Travel", logo: "/sponsors/asl-tours-travel.png" },
  { name: "BIHC", logo: "/sponsors/BIHC LOGO - JAMILLAH YUSUF.png" },
  { name: "CAMCO", logo: "/sponsors/camco.png" },
  { name: "Cgug", logo: "/sponsors/Cgug.jpg" },
  { name: "Eldoret Beauty College", logo: "/sponsors/eldoret-beauty-college.png" },
  { name: "EPZA", logo: "/sponsors/EPZA Logo with emblem (1) - jane wanjira.png" },
  { name: "Euro Lifts", logo: "/sponsors/euro-lifts.png" },
  { name: "FAW Trucks", logo: "/sponsors/faw-trucks.png" },
  { name: "Fidelity Insurance", logo: "/sponsors/fidelity-insurance.png" },
  { name: "Grappa Fashion", logo: "/sponsors/grappa-fashion.png" },
  { name: "ICEA LION", logo: "/sponsors/icea-lion.png" },
  { name: "Inkomoko", logo: "/sponsors/inkomoko.png" },
  { name: "Kasha", logo: "/sponsors/kasha.png" },
  { name: "Ken Knit", logo: "/sponsors/ken-knit.png" },
  { name: "Kenic", logo: "/sponsors/Kenic logo - Stephen Wafula.png" },
  { name: "KenTrade", logo: "/sponsors/KenTrade Logo - Frida Kaberia.jpeg" },
  { name: "Kenyatta University", logo: "/sponsors/kenyatta-university-logo-png_seeklogo-361756 - catherine wanja njeru.png" },
  { name: "Kiseki", logo: "/sponsors/Kiseki Logo - Kiseki kiseki.jpg" },
  { name: "KRA", logo: "/sponsors/kra.png" },
  { name: "Madison", logo: "/sponsors/madison.png" },
  { name: "Mount Kenya University", logo: "/sponsors/MKU_final-2 (1) - James Sumukwo.png" },
  { name: "Mwangiz Beauty", logo: "/sponsors/mwangiz-beauty.png" },
  { name: "Nadiita Soninke", logo: "/sponsors/images - Nadiita Soninke.png" },
  { name: "Nova Pioneer", logo: "/sponsors/nova pioneer .png" },
  { name: "NOREB", logo: "/sponsors/noreb.png" },
  { name: "Rapha Hospitals", logo: "/sponsors/rapha-hospitals.png" },
  { name: "Rivatex", logo: "/sponsors/rivatex.png" },
  { name: "Ruth Wasiar", logo: "/sponsors/IMG-20250416-WA0018 - Ruth Wasiar.jpg" },
  { name: "St. Luke's Hospital", logo: "/sponsors/st-lukes-hospital.png" },
  { name: "Stima Sacco", logo: "/sponsors/stima-sacco.png" },
  { name: "Tsavo", logo: "/sponsors/tsavo.png" },
  { name: "Uasin Gishu County Government", logo: "/sponsors/UG county govenment.png" },
  { name: "Partner Organization", logo: "/sponsors/KdDVMV3o_400x400.jpg" },
  { name: "Corporate Sponsor", logo: "/sponsors/yeguijfr.png" },
];

function SponsorLogo({ sponsor }: { sponsor: typeof sponsors[number] }) {
  return (
    <div className="group relative flex min-h-[130px] cursor-default items-center justify-center overflow-hidden rounded-2xl border border-border/30 bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_34px_rgba(236,37,44,0.14)]">
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="relative h-14 w-full max-w-[130px] flex items-center justify-center">
          <img
            src={sponsor.logo}
            alt={sponsor.name}
            className="max-h-full max-w-full object-contain opacity-75 grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
            loading="lazy"
          />
        </div>
        <p className="text-center text-[10px] font-medium text-muted-foreground leading-tight line-clamp-2 transition-colors group-hover:text-foreground">
          {sponsor.name}
        </p>
      </div>
    </div>
  );
}

export function SponsorsSection() {
  return (
    <section
      id="sponsors"
      className="py-20 sm:py-28 bg-background"
      data-testid="section-sponsors"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            Our Sponsors
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6"
          >
            Proudly Supported By <span className="text-primary">Industry Leaders</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            We are grateful to our sponsors whose generous support makes our events, programs, and initiatives possible.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 max-w-6xl mx-auto"
        >
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
            >
              <SponsorLogo sponsor={sponsor} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
