import { Metadata } from 'next';
import IframeAutoResizer from '@/components/IframeAutoResizer'; 

export const metadata: Metadata = {
  title: 'Job Openings | Powered by HireSkys',
  robots: {
    index: false,   
    follow: false,  
  },
};

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        html, body {
          background-color: transparent !important;
          height: fit-content !important; /* 🟢 VIP: Auto ki bajaye fit-content */
          min-height: 0 !important;
          overflow: hidden !important; 
          margin: 0 !important;
          padding: 0 !important;
        }
      `}} />
      
      {/* 🟢 THE FIX: 'h-fit' use kiya taake ye kabhi viewport ke sath stretch na ho */}
      {/* pb-8 add kiya taake bottom se cut off na ho */}
      <div id="hireskys-embed-root" className="w-full h-fit bg-transparent pb-8">
        <IframeAutoResizer /> 
        {children}
      </div>
    </>
  );
}