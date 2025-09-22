interface DashboardLayoutProps {
  welcomeHeader: React.ReactNode;
  mainContent: React.ReactNode;
  sidebar: React.ReactNode;
  additionalSections?: React.ReactNode;
  modals?: React.ReactNode;
}

export default function DashboardLayout({
  welcomeHeader,
  mainContent,
  sidebar,
  additionalSections,
  modals
}: DashboardLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      {welcomeHeader}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left Column - Main Content (7/10) */}
        <div className="lg:col-span-7">
          {mainContent}
        </div>

        {/* Right Column - Sidebar (3/10) */}
        <div className="lg:col-span-3 space-y-6">
          {sidebar}
        </div>
      </div>

      {/* Additional Sections */}
      {additionalSections}

      {/* Modals */}
      {modals}
    </div>
  );
}