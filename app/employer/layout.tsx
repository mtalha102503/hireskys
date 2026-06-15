import EmployerNavbar from '@/components/EmployerNavbar';
import EmployerSidebar from '@/components/EmployerSidebar'; // 👈 Naya Import
import VIPWhatsApp from '@/components/SupportChat';

export const metadata = {
  title: 'Employer ATS | HireSkys',
  description: 'Manage your remote hiring pipeline seamlessly.',
};

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-[#0B0F19] flex flex-col font-sans">
      
      {/* 📌 TOP NAVBAR */}
      <EmployerNavbar />

      <div className="flex flex-1 overflow-hidden">
        
        {/* 📌 NAYA JADOO: Sidebar yahan laga diya */}
        <EmployerSidebar />

        {/* 📌 MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div> 
      
      {/* VIP WhatsApp */}
      <VIPWhatsApp />
      
    </div>
  );
}