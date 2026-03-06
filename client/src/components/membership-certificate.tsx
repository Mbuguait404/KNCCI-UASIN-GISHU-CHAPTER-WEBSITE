import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, X, Printer, QrCode, FileText } from "lucide-react";

interface CertificateProps {
    memberName: string;
    regNo: string;
    businessName?: string;
    businessCategory?: string;
    plan?: string;
    certificateUrl?: string;
    logoUrl?: string;
    onClose: () => void;
}

export function MembershipCertificate({
    memberName,
    regNo,
    businessName,
    businessCategory,
    plan,
    certificateUrl,
    logoUrl,
    onClose,
}: CertificateProps) {
    const certificateRef = useRef<HTMLDivElement>(null);
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    // Helper to format URLs to be absolute
    const getFullUrl = (url?: string) => {
        if (!url) return "";
        if (url.startsWith('http')) return url;
        // Assume it's a relative path from the server
        const baseUrl = "http://localhost:3000"; // Should come from config
        return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const finalLogo = logoUrl ? getFullUrl(logoUrl) : null;
    const officialDoc = certificateUrl ? getFullUrl(certificateUrl) : null;

    const currentDate = new Date();
    const issueDate = currentDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const expiryDate = new Date();
    expiryDate.setFullYear(currentDate.getFullYear() + 1);
    const formattedExpiry = expiryDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const handlePrint = () => {
        let printContents = certificateRef.current?.innerHTML;
        if (!printContents) return;

        // Ensure images load correctly in print window by using absolute URLs
        printContents = printContents.replace(/src="\/([^"]+)"/g, `src="${origin}/$1"`);

        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>KNCCI Membership Certificate - ${businessName || memberName}</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    @page { size: portrait; margin: 0; }
                    body { 
                        margin: 0; 
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        background: white;
                        font-family: 'Inter', sans-serif;
                    }
                    .certificate-wrapper { 
                        width: 210mm; 
                        height: 297mm; 
                        position: relative; 
                        overflow: hidden;
                        background: white;
                    }
                    @media print {
                        body { margin: 0; padding: 0; }
                        .certificate-wrapper { width: 210mm; height: 297mm; }
                    }
                </style>
            </head>
            <body>
                <div class="certificate-wrapper">
                    ${printContents}
                </div>
                <script>
                    window.onload = function() {
                        setTimeout(function() { 
                            window.print(); 
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
            <div className="absolute top-6 right-6 flex flex-wrap justify-end gap-3 z-50">
                {officialDoc && (
                    <Button
                        onClick={() => window.open(officialDoc, '_blank')}
                        className="rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl px-6"
                    >
                        <FileText className="w-4 h-4 mr-2" /> Official Document
                    </Button>
                )}
                <Button
                    onClick={handleDownload}
                    className="rounded-xl font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-xl px-6"
                >
                    <Download className="w-4 h-4 mr-2" /> Download/Print
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
            <div className="w-full max-w-[800px] h-full max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-auto custom-scrollbar">
                <div
                    ref={certificateRef}
                    style={{
                        width: "100%",
                        aspectRatio: "1 / 1.414",
                        position: "relative",
                        overflow: "hidden",
                        background: "#fff",
                        fontFamily: "'Inter', sans-serif",
                    }}
                >
                    {/* Outer Border (Multi-layered colors - Red, Black, Green) */}
                    <div style={{ position: 'absolute', inset: '10px', border: '1.5px solid #ec252c' }} />
                    <div style={{ position: 'absolute', inset: '13px', border: '1.5px solid #000' }} />
                    <div style={{ position: 'absolute', inset: '16px', border: '3.5px solid #0e783d' }} />

                    {/* Content Start */}
                    <div
                        style={{
                            position: "absolute",
                            inset: "20px",
                            padding: "40px",
                            display: "flex",
                            flexDirection: "column",
                            height: "calc(100% - 40px)",
                        }}
                    >
                        {/* Header: Membership No & QR Code */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div style={{ color: '#ec252c', fontSize: '18px', fontWeight: '500' }}>
                                Membership No: {regNo.split('/').pop() || "3052603"}
                            </div>
                            <div style={{ textAlign: 'center', width: '90px' }}>
                                <div style={{ background: '#000', padding: '6px', marginBottom: '4px', borderRadius: '4px' }}>
                                    <QrCode className="w-full h-auto text-white" />
                                </div>
                                <div style={{ fontSize: '8px', color: '#666', textTransform: 'uppercase', lineHeight: '1.2' }}>
                                    POWERED BY<br />
                                    <span style={{ fontWeight: '800', fontSize: '10px', color: '#333' }}>PRIVYSEAL</span>
                                </div>
                            </div>
                        </div>

                        {/* Logo and Tagline */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', marginBottom: '40px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    {/* Brand Logo / Dots */}
                                    {finalLogo ? (
                                        <div style={{ marginBottom: '12px' }}>
                                            <img src={finalLogo} alt="Logo" style={{ height: '50px', maxWidth: '120px', objectFit: 'contain' }} />
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '12px' }}>
                                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#000' }} />
                                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#ec252c' }} />
                                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#0e783d' }} />
                                        </div>
                                    )}
                                    <h1 style={{ fontSize: '72px', fontWeight: '900', color: '#000', lineHeight: '0.8', letterSpacing: '-2px', margin: 0 }}>KNCCI</h1>
                                    <p style={{ fontSize: '11px', fontWeight: '700', color: '#333', marginTop: '8px', letterSpacing: '0.5px', textTransform: 'uppercase', maxWidth: '300px' }}>
                                        KENYA NATIONAL CHAMBER OF COMMERCE & INDUSTRY
                                    </p>
                                </div>
                                <div style={{ textAlign: 'left', borderLeft: '1px solid #ddd', paddingLeft: '25px' }}>
                                    <p style={{ fontSize: '26px', fontStyle: 'italic', color: '#ec252c', fontWeight: '700', lineHeight: '1', margin: 0 }}>Growing your</p>
                                    <p style={{ fontSize: '40px', fontWeight: '800', color: '#666', lineHeight: '1', margin: '2px 0' }}>Business</p>
                                    <p style={{ fontSize: '34px', fontWeight: '700', color: '#0e783d', lineHeight: '1', margin: 0 }}>together</p>
                                </div>
                            </div>
                        </div>

                        {/* Certification Text */}
                        <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                            <p style={{ fontSize: '24px', fontWeight: '400', color: '#000', margin: 0 }}>
                                This is to certify that
                            </p>

                            <h2 style={{ fontSize: '44px', fontWeight: '700', color: '#ec252c', margin: '10px 0', textTransform: 'uppercase' }}>
                                {businessName || memberName || "THE CUBE INNOVATION HUB"}
                            </h2>
                            <div style={{ width: '70%', height: '1.5px', background: '#333', marginBottom: '10px' }} />

                            <div style={{ fontSize: '20px', color: '#000', lineHeight: '1.4', margin: 0 }}>
                                <p style={{ margin: '4px 0' }}>is a member of the</p>
                                <p style={{ fontWeight: '500', margin: '4px 0' }}>Kenya National Chamber</p>
                                <p style={{ fontWeight: '500', margin: '4px 0' }}>of Commerce and Industry</p>
                                <p style={{ margin: '4px 0' }}>From</p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '15px 0', position: 'relative', width: '100%', justifyContent: 'center' }}>
                                <div style={{ position: 'absolute', width: '70%', height: '1px', background: '#333', zIndex: 0 }} />
                                <span style={{ background: '#fff', padding: '0 15px', fontSize: '22px', color: '#ec252c', fontWeight: '500', zIndex: 1 }}>{issueDate}</span>
                                <span style={{ background: '#fff', padding: '0 8px', fontSize: '18px', color: '#000', zIndex: 1 }}>to</span>
                                <span style={{ background: '#fff', padding: '0 15px', fontSize: '22px', color: '#ec252c', fontWeight: '500', zIndex: 1 }}>{formattedExpiry}</span>
                            </div>

                            <h3 style={{ fontSize: '60px', fontWeight: '700', color: '#f3f4f6', margin: '20px 0', letterSpacing: '1px' }}>
                                {businessCategory || plan || "Sole Proprietor (Urban)"}
                            </h3>
                        </div>

                        {/* Signatures */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 30px', marginBottom: '30px', alignItems: 'flex-end' }}>
                            <div style={{ textAlign: 'center', width: '250px' }}>
                                <div style={{ height: '80px', position: 'relative', marginBottom: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {/* Mock Signature Stamp Circle */}
                                    <div style={{
                                        position: 'absolute',
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '50%',
                                        border: '1.5px solid #000',
                                        opacity: 0.1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '8px',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        padding: '5px'
                                    }}>CHAMBER SEAL</div>
                                    <div style={{ fontFamily: 'monospace', fontSize: '20px', color: '#000', opacity: 0.7, fontStyle: 'italic', transform: 'rotate(-5deg)' }}>Dr. Erick Rutto</div>
                                </div>
                                <div style={{ width: '100%', height: '1px', background: '#333', marginBottom: '8px' }} />
                                <p style={{ fontWeight: '800', fontSize: '18px', color: '#000', margin: 0 }}>Dr. Erick Rutto</p>
                                <p style={{ fontSize: '14px', color: '#333', fontWeight: '500', margin: 0 }}>Chamber President</p>
                            </div>

                            <div style={{ textAlign: 'center', width: '250px' }}>
                                <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '5px' }}>
                                    <div style={{ fontFamily: 'monospace', fontSize: '20px', color: '#000', opacity: 0.7, fontStyle: 'italic', transform: 'rotate(-3deg)' }}>Willy Kenei</div>
                                </div>
                                <div style={{ width: '100%', height: '1px', background: '#333', marginBottom: '8px' }} />
                                <p style={{ fontWeight: '800', fontSize: '18px', color: '#000', margin: 0 }}>Willy Kenei</p>
                                <p style={{ fontSize: '14px', color: '#333', lineHeight: '1.2', fontWeight: '500', margin: 0 }}>Chairman,<br />Uasin Gishu Chapter</p>
                            </div>
                        </div>

                        {/* Footer Information */}
                        <div style={{
                            fontSize: '9.5px',
                            color: '#aaa',
                            textAlign: 'center',
                            paddingTop: '15px'
                        }}>
                            KNCCI has confirmed the above information for digital certification and sharing by PrivySeal Limited at {currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Africa/Nairobi) on {currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
