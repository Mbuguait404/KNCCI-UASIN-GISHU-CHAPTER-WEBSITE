import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Sparkles, Users, Award, TrendingUp, Target, Zap, Star, Shield } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const includedItems = [
  { icon: Zap, text: "3x3 meter exhibition booth space" },
  { icon: Star, text: "Company logo on summit materials" },
  { icon: Shield, text: "One gala dinner access card" },
  { icon: Award, text: "Certificate of participation" },
];

const benefits = [
  { icon: Users, text: "Network with 10,000+ attendees" },
  { icon: Target, text: "Showcase products to decision makers" },
  { icon: TrendingUp, text: "Generate quality leads" },
  { icon: Award, text: "Build brand visibility" },
];

const tableData = [
  { package: "Standard Booth", memberPrice: "KES 30,000", nonMemberPrice: "KES 40,000" },
  { package: "Corner Booth", memberPrice: "KES 35,000", nonMemberPrice: "KES 45,000" },
];

export function ExhibitionRatesSection() {
  return (
    <section
      id="exhibition"
      className="py-20 sm:py-28 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #fafafa 0%, #f5f5f5 50%, #fafafa 100%)" }}
      data-testid="section-exhibition"
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-[#ec252c] font-semibold text-sm uppercase tracking-wider bg-red-50 px-4 py-2 rounded-full border border-red-100">
            <Sparkles className="h-4 w-4" />
            Exhibition Opportunities
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-6 mb-6"
            data-testid="text-exhibition-title"
          >
            Exhibition Rates
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Showcase your products and services to thousands of business leaders, government
            officials, and decision-makers at the Eldoret International Business Summit 2026.
          </p>
        </motion.div>

        {/* Pricing Table */}
        <motion.div
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
              <div className="px-6 py-5 text-left font-bold text-lg border-r border-gray-700">
                Package
              </div>
              <div className="px-6 py-5 text-center font-bold text-lg border-r border-gray-700 flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-300" />
                  <span>KNCCI Member</span>
                </div>
                <span className="text-xs font-normal text-blue-200 mt-1">Exclusive pricing</span>
              </div>
              <div className="px-6 py-5 text-center font-bold text-lg flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-300" />
                  <span>Non-Member</span>
                </div>
                <span className="text-xs font-normal text-orange-200 mt-1">Standard rates</span>
              </div>
            </div>

            {/* Table Body */}
            {tableData.map((row, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 ${
                  index !== tableData.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <div className="px-6 py-6 text-left border-r border-gray-100">
                  <span className="font-semibold text-gray-900 text-lg">{row.package}</span>
                </div>
                <div className="px-6 py-6 text-center border-r border-gray-100 bg-blue-50/50">
                  <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                    {row.memberPrice}
                  </span>
                </div>
                <div className="px-6 py-6 text-center bg-orange-50/50">
                  <span className="text-2xl sm:text-3xl font-bold text-orange-600">
                    {row.nonMemberPrice}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Table Note */}
          <p className="text-center text-gray-500 text-sm mt-4">
            All prices include standard 3x3m exhibition booth space and listed amenities
          </p>
        </motion.div>

        {/* Info Cards Grid */}
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6 mb-16">
          {/* What's Included Card */}
          <motion.div
            className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-[#ec252c]" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">What&apos;s Included?</h4>
            </div>
            <ul className="space-y-3">
              {includedItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-50 flex items-center justify-center mt-0.5">
                    <item.icon className="h-3.5 w-3.5 text-[#ec252c]" />
                  </div>
                  <span className="text-gray-700">{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Why Exhibit Card */}
          <motion.div
            className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-[#ec252c]" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Why Exhibit?</h4>
            </div>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-50 flex items-center justify-center mt-0.5">
                    <benefit.icon className="h-3.5 w-3.5 text-[#ec252c]" />
                  </div>
                  <span className="text-gray-700">{benefit.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="inline-block bg-white p-10 sm:p-14 rounded-2xl border border-gray-200 shadow-xl max-w-3xl">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Ready to Exhibit?
            </h3>
            <p className="text-gray-600 text-lg mb-10 max-w-xl mx-auto">
              Secure your exhibition space today and connect with thousands of potential customers
              at Kenya&apos;s premier business summit!
            </p>
            <Link href="/exhibition-booking">
              <Button
                size="lg"
                className="bg-[#ec252c] hover:bg-red-700 text-white text-xl px-14 py-8 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 hover:-translate-y-0.5 h-auto"
                data-testid="button-book-exhibition"
              >
                Request Exhibition Space
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
