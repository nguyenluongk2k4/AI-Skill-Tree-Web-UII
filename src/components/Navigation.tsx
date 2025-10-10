import { Home, GitBranch, FileQuestion, Briefcase, TrendingUp, LogOut } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'skilltree', label: 'Skill Tree', icon: GitBranch },
    { id: 'quiz', label: 'Quiz', icon: FileQuestion },
    { id: 'jobs', label: 'Job Matches', icon: Briefcase },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
  ];

  return (
    <nav className="w-64 bg-white border-r border-border min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-teal-500">
          AI Skill Tree
        </h1>
        <p className="text-muted-foreground mt-1">Learn & Grow</p>
      </div>
      
      <div className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-violet-50 to-teal-50 text-violet-700'
                  : 'text-foreground hover:bg-accent'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      
      <button
        onClick={() => onNavigate('landing')}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent transition-all"
      >
        <LogOut className="w-5 h-5" />
        <span>Sign Out</span>
      </button>
    </nav>
  );
}
