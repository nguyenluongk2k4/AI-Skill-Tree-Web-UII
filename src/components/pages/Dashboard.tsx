import { MetricCard } from '../MetricCard';
import { Clock, Award, Target, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const weeklyData = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 3.2 },
  { day: 'Wed', hours: 1.8 },
  { day: 'Thu', hours: 4.1 },
  { day: 'Fri', hours: 2.9 },
  { day: 'Sat', hours: 3.5 },
  { day: 'Sun', hours: 2.2 },
];

const skillProgress = [
  { skill: 'Python', progress: 85 },
  { skill: 'ML', progress: 72 },
  { skill: 'Stats', progress: 68 },
  { skill: 'SQL', progress: 90 },
  { skill: 'React', progress: 55 },
];

export function Dashboard() {
  return (
    <div className="flex-1 bg-gradient-to-br from-white via-violet-50/20 to-teal-50/20 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Welcome back, Alex</h1>
          <p className="text-muted-foreground">Track your learning progress and continue your journey</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Total Learning Time"
            value="127.5 hours"
            icon={Clock}
            subtitle="This month"
            trend="+12%"
          />
          <MetricCard
            title="Skills Unlocked"
            value="18 / 25"
            icon={Award}
            subtitle="72% complete"
            trend="+3"
          />
          <MetricCard
            title="Quiz Accuracy"
            value="87.3%"
            icon={Target}
            subtitle="Average score"
            trend="+5.2%"
          />
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Weekly Activity */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-foreground mb-1">Weekly Activity</h3>
                <p className="text-muted-foreground">Hours spent learning</p>
              </div>
              <TrendingUp className="w-5 h-5 text-teal-600" />
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="url(#colorGradient)" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Skill Progress */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-foreground mb-1">Skill Progress</h3>
                <p className="text-muted-foreground">Current skill levels</p>
              </div>
              <Award className="w-5 h-5 text-violet-600" />
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={skillProgress} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#71717a" />
                <YAxis type="category" dataKey="skill" stroke="#71717a" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="progress" fill="url(#barGradient)" radius={[0, 8, 8, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'Completed Quiz', detail: 'Advanced Python Concepts', time: '2 hours ago', score: '94%' },
              { action: 'Unlocked Skill', detail: 'Machine Learning Fundamentals', time: '1 day ago', score: null },
              { action: 'Completed Module', detail: 'Data Structures & Algorithms', time: '2 days ago', score: '89%' },
              { action: 'Started Course', detail: 'Deep Learning Specialization', time: '3 days ago', score: null },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-foreground">{item.action}</p>
                  <p className="text-muted-foreground">{item.detail}</p>
                </div>
                <div className="text-right">
                  {item.score && (
                    <p className="text-teal-600 mb-1">{item.score}</p>
                  )}
                  <p className="text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
