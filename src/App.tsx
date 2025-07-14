import React, { useState } from 'react';
import { CRMProvider } from './contexts/CRMContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import LeadManagement from './components/LeadManagement';
import PartnerManagement from './components/PartnerManagement';
import RoutingRules from './components/RoutingRules';
import Analytics from './components/Analytics';
import AdminPanel from './components/AdminPanel';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'leads':
        return <LeadManagement />;
      case 'partners':
        return <PartnerManagement />;
      case 'sources':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Traffic Sources</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>;
      case 'routing':
        return <RoutingRules />;
      case 'analytics':
        return <Analytics />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <CRMProvider>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderCurrentPage()}
      </Layout>
    </CRMProvider>
  );
}

export default App;