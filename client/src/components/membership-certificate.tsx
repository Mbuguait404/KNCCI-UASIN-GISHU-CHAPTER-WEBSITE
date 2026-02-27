import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, X, Printer } from "lucide-react";

interface CertificateProps {
    memberName: string;
    regNo: string;
    businessName?: string;
    businessCategory?: string;
    plan?: string;
    onClose: () => void;
}

export function MembershipCertificate({
    memberName,
    regNo,
    businessName,
    businessCategory,
    plan,
    onClose,
}: CertificateProps) {
    const certificateRef = useRef<HTMLDivElement>(null);

    const currentDate = new Date();
    const issueDate = currentDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const handlePrint = () => {
        let printContents = certificateRef.current?.innerHTML;
        if (!printContents) return;

        // Ensure images load correctly in print window by using absolute URLs
        const origin = window.location.origin;
        printContents = printContents.replace(/src="\/([^"]+)"/g, `src="${origin}/$1"`);

        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>KNCCI Membership Certificate - ${memberName}</title>
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700&family=Great+Vibes&display=swap" rel="stylesheet">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    @page { size: landscape; margin: 0; }
                    body { 
                        margin: 0; 
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        background: white;
                    }
                    .certificate-wrapper { 
                        width: 297mm; 
                        height: 210mm; 
                        position: relative; 
                        overflow: hidden;
                    }
                    @media print {
                        body { margin: 0; padding: 0; }
                        .certificate-wrapper { width: 100vw; height: 100vh; }
                    }
                </style>
            </head>
            <body>
                ${printContents}
                <script>
                    window.onload = function() {
                        setTimeout(function() { 
                            window.print(); 
                            // window.close(); // Optional: comment out for debugging if needed
                        }, 800);
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    const handleDownload = () => {
        handlePrint();
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Close & Action Buttons */}
            <div className="absolute top-6 right-6 flex gap-3 z-50">
                <Button
                    onClick={handleDownload}
                    className="rounded-xl font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-xl px-6"
                >
                    <Download className="w-4 h-4 mr-2" /> Download PDF
                </Button>
                <Button
                    onClick={handlePrint}
                    variant="outline"
                    className="rounded-xl font-bold border-white/30 text-white hover:bg-white/10 shadow-xl px-6"
                >
                    <Printer className="w-4 h-4 mr-2" /> Print
                </Button>
                <Button
                    onClick={onClose}
                    variant="ghost"
                    className="rounded-xl text-white hover:bg-white/10 w-12 h-12"
                >
                    <X className="w-6 h-6" />
                </Button>
            </div>

            {/* Certificate Preview */}
            <div className="w-full max-w-[1000px] aspect-[1.414/1] overflow-auto">
                <div ref={certificateRef}>
                    <div
                        className="certificate-wrapper"
                        style={{
                            width: "100%",
                            aspectRatio: "1.414 / 1",
                            position: "relative",
                            overflow: "hidden",
                            background: "#fff",
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        {/* Background subtle tint */}
                        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, #fff 0%, #f9fafb 100%)', opacity: 0.5 }} />

                        {/* Ornamental Border - Brand Green */}
                        <div
                            style={{
                                position: "absolute",
                                inset: "12px",
                                border: "4px solid #0e783d",
                                borderRadius: "4px",
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                inset: "20px",
                                border: "1px solid #ec252c60",
                                borderRadius: "2px",
                            }}
                        />

                        {/* Corner Ornaments */}
                        {["top-left", "top-right", "bottom-left", "bottom-right"].map((corner) => {
                            const isTop = corner.includes("top");
                            const isLeft = corner.includes("left");
                            return (
                                <div
                                    key={corner}
                                    style={{
                                        position: "absolute",
                                        [isTop ? "top" : "bottom"]: "28px",
                                        [isLeft ? "left" : "right"]: "28px",
                                        width: "80px",
                                        height: "80px",
                                        borderTop: isTop ? "4px solid #0e783d" : "none",
                                        borderBottom: !isTop ? "4px solid #0e783d" : "none",
                                        borderLeft: isLeft ? "4px solid #0e783d" : "none",
                                        borderRight: !isLeft ? "4px solid #0e783d" : "none",
                                    }}
                                />
                            );
                        })}

                        {/* Watermark Pattern - Suble Logo or Text */}
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                opacity: 0.02,
                                backgroundImage: `repeating-linear-gradient(45deg, #0e783d 0px, #0e783d 1px, transparent 1px, transparent 40px)`,
                            }}
                        />

                        {/* Content */}
                        <div
                            style={{
                                position: "relative",
                                zIndex: 10,
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "40px 60px",
                                textAlign: "center",
                            }}
                        >
                            {/* KNCCI Logo Area */}
                            <div style={{ marginBottom: "12px" }}>
                                <img
                                    src="/UG_chapter_logo-removebg-preview.png"
                                    alt="KNCCI Logo"
                                    style={{ width: "140px", height: "auto", objectFit: "contain" }}
                                />
                            </div>

                            {/* Organization Name */}
                            <h2
                                style={{
                                    fontSize: "14px",
                                    fontWeight: 800,
                                    letterSpacing: "4px",
                                    textTransform: "uppercase",
                                    color: "#0e783d",
                                    marginBottom: "4px",
                                }}
                            >
                                Kenya National Chamber of Commerce & Industry
                            </h2>
                            <p
                                style={{
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    letterSpacing: "3px",
                                    textTransform: "uppercase",
                                    color: "#ec252c",
                                    marginBottom: "16px",
                                }}
                            >
                                Uasin Gishu Chapter
                            </p>

                            {/* Decorative Line */}
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", width: "60%" }}>
                                <div style={{ flex: 1, height: "2px", background: "linear-gradient(to right, transparent, #0e783d)" }} />
                                <div style={{ width: "10px", height: "10px", transform: "rotate(45deg)", background: "#ec252c" }} />
                                <div style={{ flex: 1, height: "2px", background: "linear-gradient(to left, transparent, #0e783d)" }} />
                            </div>

                            {/* Certificate Title */}
                            <h1
                                style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "42px",
                                    fontWeight: 900,
                                    color: "#0e783d",
                                    letterSpacing: "2px",
                                    marginBottom: "8px",
                                    textTransform: "uppercase",
                                }}
                            >
                                Certificate of Membership
                            </h1>

                            {/* Subtitle */}
                            <p
                                style={{
                                    fontSize: "14px",
                                    color: "#88807e",
                                    letterSpacing: "2px",
                                    textTransform: "uppercase",
                                    marginBottom: "16px",
                                    fontWeight: 600,
                                }}
                            >
                                This is to certify that
                            </p>

                            {/* Member Name */}
                            <h2
                                style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "38px",
                                    fontWeight: 700,
                                    color: "#111",
                                    marginBottom: "8px",
                                    borderBottom: "2px solid #ec252c",
                                    paddingBottom: "8px",
                                    paddingLeft: "50px",
                                    paddingRight: "50px",
                                }}
                            >
                                {memberName}
                            </h2>

                            {/* Business Name & Category */}
                            {businessName && (
                                <p
                                    style={{
                                        fontSize: "16px",
                                        color: "#0e783d",
                                        fontWeight: 700,
                                        marginBottom: "4px",
                                    }}
                                >
                                    {businessName}
                                    {businessCategory ? ` — ${businessCategory}` : ""}
                                </p>
                            )}

                            {/* Registration Number */}
                            <p
                                style={{
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    letterSpacing: "3px",
                                    color: "#88807e",
                                    textTransform: "uppercase",
                                    marginBottom: "16px",
                                }}
                            >
                                Reg. No: {regNo}
                            </p>

                            {/* Description */}
                            <p
                                style={{
                                    fontSize: "14px",
                                    color: "#4b5563",
                                    maxWidth: "650px",
                                    lineHeight: "1.6",
                                    marginBottom: "24px",
                                    fontWeight: 500,
                                }}
                            >
                                is a duly registered {plan || "Full"} member of the Kenya National Chamber of Commerce and Industry,
                                Uasin Gishu Chapter, and is entitled to all the rights, privileges, and benefits
                                accorded to members of the Chamber.
                            </p>

                            {/* Signatories */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-end",
                                    width: "100%",
                                    maxWidth: "700px",
                                    marginTop: "auto"
                                }}
                            >
                                {/* Date */}
                                <div style={{ textAlign: "center", minWidth: "180px" }}>
                                    <p
                                        style={{
                                            fontSize: "14px",
                                            fontWeight: 700,
                                            color: "#111",
                                            marginBottom: "4px",
                                        }}
                                    >
                                        {issueDate}
                                    </p>
                                    <div style={{ width: "100%", height: "2px", background: "#0e783d", marginBottom: "4px" }} />
                                    <p
                                        style={{
                                            fontSize: "10px",
                                            fontWeight: 700,
                                            letterSpacing: "2px",
                                            textTransform: "uppercase",
                                            color: "#88807e",
                                        }}
                                    >
                                        Date of Issue
                                    </p>
                                </div>

                                {/* Seal */}
                                <div style={{ textAlign: "center" }}>
                                    <div
                                        style={{
                                            width: "90px",
                                            height: "90px",
                                            borderRadius: "50%",
                                            border: "3px solid #0e783d",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            margin: "0 auto",
                                            position: "relative",
                                            background: "#fff",
                                            boxShadow: "0 0 0 4px #ec252c20"
                                        }}
                                    >
                                        <img
                                            src="/UG_chapter_logo-removebg-preview.png"
                                            alt="Seal Logo"
                                            style={{ width: "60px", opacity: 0.2, position: 'absolute' }}
                                        />
                                        <div
                                            style={{
                                                width: "78px",
                                                height: "78px",
                                                borderRadius: "50%",
                                                border: "1px dashed #ec252c",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                zIndex: 1,
                                            }}
                                        >
                                            <span style={{ fontSize: "10px", fontWeight: 900, color: "#0e783d", letterSpacing: "1px" }}>
                                                KNCCI
                                            </span>
                                            <span style={{ fontSize: "7px", fontWeight: 700, color: "#ec252c", letterSpacing: "1px" }}>
                                                OFFICIAL SEAL
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Chairman Signature */}
                                <div style={{ textAlign: "center", minWidth: "180px" }}>
                                    <p
                                        style={{
                                            fontFamily: "'Great Vibes', cursive",
                                            fontSize: "28px",
                                            color: "#0e783d",
                                            marginBottom: "2px",
                                        }}
                                    >
                                        Willy K. Kenei
                                    </p>
                                    <div style={{ width: "100%", height: "2px", background: "#0e783d", marginBottom: "4px" }} />
                                    <p
                                        style={{
                                            fontSize: "13px",
                                            fontWeight: 800,
                                            color: "#111",
                                        }}
                                    >
                                        Willy K. Kenei
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "10px",
                                            fontWeight: 700,
                                            letterSpacing: "2px",
                                            textTransform: "uppercase",
                                            color: "#88807e",
                                        }}
                                    >
                                        Chairman
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
