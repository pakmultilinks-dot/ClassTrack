import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <div className="fixed inset-0 -z-10 bg-brand-radial" />
      <div className="fixed left-1/3 top-0 -z-10 h-96 w-96 rounded-full bg-brand-primary/15 blur-3xl" />
      <div className="fixed bottom-0 right-0 -z-10 h-96 w-96 rounded-full bg-brand-secondary/10 blur-3xl" />

      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col lg:pl-72">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="px-4 pb-8 pt-24 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
