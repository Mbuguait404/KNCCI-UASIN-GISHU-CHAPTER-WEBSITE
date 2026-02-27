import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo/seo-head";
import { boardMembers, BoardMember } from "@/data/board-members";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, ShieldCheck, Briefcase } from "lucide-react";

export default function Board() {
    const categories = [
        {
            id: "Executive",
            title: "Executive Committee",
            icon: ShieldCheck,
            description: "Our core leadership team overseeing the strategic direction of the chapter."
        },
        {
            id: "Director",
            title: "Board of Directors",
            icon: Users,
            description: "Subject matter experts and industry leaders representing various sectors."
        },
        {
            id: "Secretariat",
            title: "Secretariat",
            icon: Briefcase,
            description: "The dedicated team managing day-to-day operations and member services."
        }
    ];

    const getMembersByCategory = (category: string) => {
        return boardMembers.filter(member => member.category === category);
    };

    return (
        <>
            <SEOHead
                title="Board of Directors | KNCCI Uasin Gishu Chapter"
                description="Meet the leadership team of the Kenya National Chamber of Commerce & Industry, Uasin Gishu Chapter. Our board members and secretariat are dedicated to growing your business."
                keywords={[
                    "KNCCI Board",
                    "Uasin Gishu Chamber Leadership",
                    "Willy Kenei",
                    "KNCCI Directors Eldoret",
                    "Kenya Chamber of Commerce Leadership",
                ]}
                canonicalUrl={
                    typeof window !== "undefined" ? `${window.location.origin}/board` : ""
                }
            />
            <div className="min-h-screen bg-background">
                <Navigation />
                <main>
                    {/* Hero Section */}
                    <section className="relative py-20 sm:py-32 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-kncci-green/5 -z-10" />
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
                        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-kncci-green/5 rounded-full blur-3xl -z-10" />

                        <div className="max-w-7xl mx-auto px-4 text-center">
                            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
                                Leadership Team
                            </span>
                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight">
                                Governing <span className="text-kncci-green">Board</span>
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                Meet the men and women dedicated to fostering a conducive business
                                environment and driving economic growth in Uasin Gishu County.
                            </p>
                        </div>
                    </section>

                    {/* Board Members Sections */}
                    {categories.map((category) => {
                        const members = getMembersByCategory(category.id);
                        if (members.length === 0) return null;

                        return (
                            <section key={category.id} className="py-16 sm:py-24 border-t border-border/50">
                                <div className="max-w-7xl mx-auto px-4">
                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                                        <div className="max-w-2xl">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                                    <category.icon className="w-6 h-6" />
                                                </div>
                                                <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                                                    {category.title}
                                                </h2>
                                            </div>
                                            <p className="text-muted-foreground">{category.description}</p>
                                        </div>
                                        <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-border/50 to-transparent ml-8" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                                        {members.map((member, index) => (
                                            <MemberCard key={index} member={member} index={index} />
                                        ))}
                                    </div>
                                </div>
                            </section>
                        );
                    })}

                    {/* Join Us CTA */}
                    <section className="py-24 bg-slate-900 text-background relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-kncci-green/20 opacity-30" />
                        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-6 animate-fade-in">Want to get involved?</h2>
                            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
                                Join the largest business network in the region and be part of
                                the change you want to see in our economy.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <a
                                    href="/membership"
                                    className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all w-full sm:w-auto hover:shadow-lg hover:shadow-primary/25"
                                >
                                    Join KNCCI Today
                                </a>
                                <a
                                    href="/contact"
                                    className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/10 w-full sm:w-auto backdrop-blur-sm"
                                >
                                    Contact Secretariat
                                </a>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        </>
    );
}

function MemberCard({ member, index }: { member: BoardMember; index: number }) {
    const initials = member.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2);

    return (
        <Card
            className="group relative overflow-hidden border-border/50 bg-card/50 hover:bg-card hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <CardContent className="p-8">
                <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                        <Avatar className="w-32 h-32 border-4 border-background shadow-xl ring-2 ring-primary/10 transition-transform duration-700 group-hover:scale-110">
                            <AvatarImage src={member.image} alt={member.name} className="object-cover" />
                            <AvatarFallback className="bg-gradient-to-br from-primary/10 via-primary/5 to-kncci-green/10 text-primary text-2xl font-bold group-hover:from-primary/20 group-hover:to-kncci-green/20 transition-colors duration-500">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        {/* Decorative ring that rotates on hover */}
                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 scale-110 opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-1000" />
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                        {member.name}
                    </h3>
                    <p className="text-primary/80 font-semibold text-sm mb-4 tracking-wide">
                        {member.role}
                    </p>

                    {member.description && (
                        <div className="pt-4 border-t border-border/50 w-full mt-2">
                            <p className="text-muted-foreground text-sm italic leading-relaxed line-clamp-3">
                                "{member.description}"
                            </p>
                        </div>
                    )}
                </div>

                {/* Subtle Decorative Background Element */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-16 h-16 bg-kncci-green/5 rounded-full blur-xl group-hover:bg-kncci-green/10 transition-colors" />
            </CardContent>
        </Card>
    );
}
