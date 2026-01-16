"use client";
import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { Download, Award, Loader2, CheckCircle } from 'lucide-react';

export default function Certificate({ userName, skill, date }: { userName: string, skill: string, date: string }) {
  const previewRef = useRef<HTMLDivElement>(null);
  const pdfPage1Ref = useRef<HTMLDivElement>(null);
  const pdfPage2Ref = useRef<HTMLDivElement>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);

  // Ensure Date is never empty
  const displayDate = date || new Date().toLocaleDateString();

  const generatePDF = async () => {
    setIsGenerating(true);

    try {
      const doc = new jsPDF('p', 'pt', 'a4');
      
      // --- PAGE 1: CERTIFICATE ---
      if (pdfPage1Ref.current) {
        const imgData1 = await toPng(pdfPage1Ref.current, { 
            quality: 1.0, 
            pixelRatio: 2, 
            cacheBust: true,
        });
        doc.addImage(imgData1, 'PNG', 0, 0, 595.28, 841.89);
      }

      // --- PAGE 2: DETAILS ---
      doc.addPage();
      if (pdfPage2Ref.current) {
        const imgData2 = await toPng(pdfPage2Ref.current, {
            quality: 1.0,
            pixelRatio: 2,
            cacheBust: true,
        });
        doc.addImage(imgData2, 'PNG', 0, 0, 595.28, 841.89);
      }

      doc.save(`HireSkys-Certificate-${skill.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error("PDF Error:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
      
      {/* =======================
          1. VISUAL PREVIEW (Screen)
      ======================== */}
      <div 
        ref={previewRef}
        className="w-full relative aspect-[1.414/1] bg-white shadow-2xl rounded-lg overflow-hidden border-4 border-slate-200"
        style={{ containerType: 'inline-size' }} 
      >
         <div className="w-full h-full bg-white text-slate-900 flex flex-col items-center text-center justify-between p-[5%]"
            style={{ fontFamily: "'Times New Roman', serif", border: '1.5cqw double #D4AF37' }}>
            
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
                <img 
        src="/logo.png" 
        alt="Watermark" 
        className="w-[60%] h-[60%] object-contain grayscale" 
    />
            </div>

            {/* HEADER */}
            <div className="w-full flex flex-col items-center z-10">
                <div className="flex items-center gap-[1cqw] mb-[1cqw]">
                    <img src="/logo.png" alt="HireSkys" style={{ height: '6cqw' }} className="object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                    <span className="font-bold text-[#1e293b]" style={{ fontSize: '4cqw', fontFamily: 'sans-serif', letterSpacing: '-0.02em' }}>HireSkys</span>
                </div>

                <h1 className="font-black text-[#1a202c] uppercase tracking-widest leading-none mt-[1cqw]" style={{ fontSize: '6cqw' }}>Certificate</h1>
                <p className="text-[#D4AF37] font-semibold italic tracking-wider" style={{ fontSize: '1.8cqw' }}>OF PROFICIENCY</p>
            </div>

            {/* BODY */}
            <div className="z-10 w-full flex flex-col items-center justify-center flex-grow">
                <p className="text-slate-500 italic mb-[1cqw]" style={{ fontSize: '1.8cqw' }}>This is to certify that</p>
                <h2 className="font-bold text-[#1a202c] border-b-2 border-[#D4AF37]/30 pb-[1cqw] px-8 mb-[2cqw] font-serif" style={{ fontSize: '4.5cqw' }}>
                    {userName || "Valued User"}
                </h2>
                <p className="text-slate-500 mb-[1cqw]" style={{ fontSize: '1.8cqw' }}>Has successfully passed the advanced assessment for</p>
                <h3 className="font-bold text-[#D4AF37] uppercase tracking-widest px-4 leading-tight" style={{ fontSize: '4cqw' }}>
                    {skill}
                </h3>
            </div>

            {/* FOOTER */}
            <div className="flex justify-between items-end w-full mt-auto z-10 px-[2%]">
                <div className="text-center">
                    <div className="border-b border-slate-400 pb-[0.5cqw] mb-[0.5cqw] px-2 font-serif text-[#1e293b]" style={{ fontSize: '2cqw' }}>
                        {displayDate}
                    </div>
                    <p className="font-bold uppercase tracking-widest text-slate-400" style={{ fontSize: '1cqw' }}>Date Issued</p>
                </div>
                <div className="mb-[1cqw]"><Award size={48} className="text-[#D4AF37]" /></div>
                <div className="text-center">
                    <div className="text-indigo-900 border-b border-slate-400 pb-[0.5cqw] mb-[0.5cqw] px-2" style={{ fontFamily: 'cursive', fontSize: '3cqw' }}>HireSkys</div>
                    <p className="font-bold uppercase tracking-widest text-slate-400" style={{ fontSize: '1cqw' }}>Verified By</p>
                </div>
            </div>
         </div>
      </div>


      {/* =======================
          2. HIDDEN PDF TEMPLATES (Fixed A4 Size)
          🛑 FIX: Changed position to 'fixed' and added overflow hidden 
          so it doesn't take up scroll space.
      ======================== */}
      <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
        
        {/* --- PDF PAGE 1 --- */}
        <div ref={pdfPage1Ref} style={{ width: '794px', height: '1123px', backgroundColor: 'white', padding: '40px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <div style={{ width: '100%', height: '100%', border: '10px double #D4AF37', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', fontFamily: "'Times New Roman', serif", position: 'relative' }}>
                
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.05 }}>
                    <img 
        src="/logo.png" 
        alt="Watermark" 
        style={{ width: '500px', height: '500px', objectFit: 'contain', filter: 'grayscale(100%)' }} 
    />
                </div>

                {/* Header */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                        <img src="/logo.png" style={{ height: '70px' }} />
                        <span style={{ fontSize: '40px', fontWeight: 'bold', fontFamily: 'sans-serif', color: '#1e293b', letterSpacing: '-1px' }}>HireSkys</span>
                    </div>
                    
                    <h1 style={{ fontSize: '60px', fontWeight: '900', color: '#1a202c', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Certificate</h1>
                    <p style={{ fontSize: '24px', color: '#D4AF37', fontStyle: 'italic', fontWeight: '600', letterSpacing: '0.1em', marginTop: '10px' }}>OF PROFICIENCY</p>
                </div>

                {/* Body */}
                <div style={{ textAlign: 'center', zIndex: 10, width: '100%' }}>
                    <p style={{ fontSize: '20px', color: '#64748b', fontStyle: 'italic' }}>This is to certify that</p>
                    <h2 style={{ fontSize: '52px', fontWeight: 'bold', color: '#1a202c', borderBottom: '2px solid rgba(212, 175, 55, 0.3)', paddingBottom: '10px', margin: '30px auto', display: 'inline-block', minWidth: '400px', fontFamily: 'serif' }}>
                        {userName}
                    </h2>
                    <p style={{ fontSize: '20px', color: '#64748b' }}>Has successfully passed the advanced assessment for</p>
                    <h3 style={{ fontSize: '48px', fontWeight: 'bold', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '20px' }}>
                        {skill}
                    </h3>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', padding: '0 40px', zIndex: 10 }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', borderBottom: '1px solid #94a3b8', paddingBottom: '5px', minWidth: '150px', color: '#1e293b' }}>
                            {displayDate}
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#94a3b8', marginTop: '5px' }}>Date Issued</p>
                    </div>
                    
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFD700, #B8860B)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '4px solid white' }}>
                        <Award size={50} color="white" />
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '36px', color: '#312e81', borderBottom: '1px solid #94a3b8', paddingBottom: '5px', minWidth: '150px', fontFamily: 'cursive' }}>HireSkys</div>
                        <p style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#94a3b8', marginTop: '5px' }}>Verified By</p>
                    </div>
                </div>
            </div>
        </div>

        {/* --- PDF PAGE 2: DETAILS --- */}
        <div ref={pdfPage2Ref} style={{ width: '794px', height: '1123px', backgroundColor: '#0B0F19', color: 'white', padding: '60px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '50px', borderBottom: '1px solid #1e293b', paddingBottom: '30px' }}>
                <img src="/logo.png" style={{ height: '60px' }} />
                <div>
                    <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: 0 }}>HireSkys</h1>
                    <p style={{ fontSize: '16px', color: '#94a3b8' }}>The Elite Job Radar</p>
                </div>
            </div>

            <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '28px', color: '#818cf8', marginBottom: '20px' }}>About the Verification</h2>
                <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#cbd5e1', marginBottom: '40px' }}>
                    This candidate has successfully cleared the <strong>HireSkys Skill Challenge</strong>. 
                    Our verification process goes beyond simple multiple-choice questions. It involves:
                </p>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ width: '50px' }}><CheckCircle color="#4ade80" size={30} /></div>
                    <div>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 5px 0' }}>AI-Proctored Exams</h3>
                        <p style={{ fontSize: '14px', color: '#94a3b8' }}>Real-time analysis to prevent cheating and ensure integrity.</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ width: '50px' }}><CheckCircle color="#fbbf24" size={30} /></div>
                    <div>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 5px 0' }}>Practical Scenarios</h3>
                        <p style={{ fontSize: '14px', color: '#94a3b8' }}>Live coding environments and real-world problem solving.</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '50px' }}>
                    <div style={{ width: '50px' }}><CheckCircle color="#f87171" size={30} /></div>
                    <div>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 5px 0' }}>Strict Evaluation</h3>
                        <p style={{ fontSize: '14px', color: '#94a3b8' }}>Candidates must score 9/10 or higher to earn this badge.</p>
                    </div>
                </div>

                <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '10px', border: '1px solid #334155' }}>
                    <h2 style={{ fontSize: '24px', color: 'white', marginBottom: '10px' }}>What is HireSkys?</h2>
                    <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6' }}>
                        HireSkys is an advanced stealth job hunting platform. We scan thousands of hidden communities, 
                        Reddit threads, and niche boards to find opportunities before they hit major job sites. 
                        We connect elite talent with high-value clients.
                    </p>
                </div>
            </div>

            <div style={{ textAlign: 'center', color: '#475569', fontSize: '12px', marginTop: 'auto' }}>
                <p>&copy; {new Date().getFullYear()} HireSkys Platform. All Rights Reserved.</p>
                <p>Verified Securely via Blockchain-Ready AI Infrastructure.</p>
            </div>

        </div>
      </div>

      {/* DOWNLOAD BUTTON */}
      <button 
        onClick={generatePDF}
        disabled={isGenerating}
        className="mt-8 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-3 disabled:opacity-70"
      >
        {isGenerating ? (
            <><Loader2 size={20} className="animate-spin"/> Generating PDF...</>
        ) : (
            <><Download size={20} /> Download PDF (2 Pages)</>
        )}
      </button>

    </div>
  );
}