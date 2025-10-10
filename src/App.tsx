import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Landing } from './components/pages/Landing';
import { Dashboard } from './components/pages/Dashboard';
import { SkillTree } from './components/pages/SkillTree';
import { Quiz } from './components/pages/Quiz';
import { JobRecommendation } from './components/pages/JobRecommendation';
import { LearningInsights } from './components/pages/LearningInsights';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard />;
      case 'skilltree':
        return <SkillTree />;
      case 'quiz':
        return <Quiz />;
      case 'jobs':
        return <JobRecommendation />;
      case 'insights':
        return <LearningInsights />;
      default:
        return <Landing onNavigate={setCurrentPage} />;
    }
  };

  if (currentPage === 'landing') {
    return <Landing onNavigate={setCurrentPage} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  );
}
