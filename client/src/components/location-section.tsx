export function LocationSection() {
    return (
        <section
            id="location"
            className="py-20 sm:py-28 bg-background"
            data-testid="section-location"
        >
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                            Location
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6" data-testid="text-location-title">
                            Our Location
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                            Visit us at the KNCCI Uasin Gishu Chamber. We are located in Eldoret, ready to serve the business community.
                        </p>
                    </div>

                    <div className="rounded-2xl overflow-hidden border border-border shadow-2xl bg-muted/30 backdrop-blur-sm">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.6571012210875!2d35.289277!3d0.5150754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x178101f7621d3ed5%3A0x60dc9d828e2da34!2sKNCCI%20Uasin%20Gishu%20Chamber!5e0!3m2!1sen!2ske!4v1771439323231!5m2!1sen!2ske"
                            width="100%"
                            height="500"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="KNCCI Uasin Gishu Chamber Map"
                            className="grayscale-[20%] contrast-[110%] transition-all duration-300 hover:grayscale-0"
                        ></iframe>
                    </div>

                    {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                            <h3 className="font-bold text-lg mb-2">Address</h3>
                            <p className="text-muted-foreground">KNCCI Uasin Gishu Chamber, Eldoret, Kenya</p>
                        </div>
                        <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                            <h3 className="font-bold text-lg mb-2">Email Us</h3>
                            <p className="text-muted-foreground">info@kncciuasingishu.co.ke</p>
                        </div>
                        <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                            <h3 className="font-bold text-lg mb-2">Call Us</h3>
                            <p className="text-muted-foreground">+254 (0) 123 456 789</p>
                        </div>
                    </div> */}
                </div>
            </div>
        </section>
    );
}
