import { Award, TrendingUp, Target, Brain, Trophy, Zap } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const performanceData = [
  { week: 'Week 1', score: 65, hours: 8 },
  { week: 'Week 2', score: 72, hours: 10 },
  { week: 'Week 3', score: 78, hours: 12 },
  { week: 'Week 4', score: 85, hours: 11 },
  { week: 'Week 5', score: 88, hours: 13 },
  { week: 'Week 6', score: 92, hours: 14 },
];

const skillRadarData = [
  { skill: 'Python', current: 85, target: 95 },
  { skill: 'ML', current: 72, target: 90 },
  { skill: 'Stats', current: 68, target: 85 },
  { skill: 'Algorithms', current: 78, target: 90 },
  { skill: 'Data Viz', current: 55, target: 75 },
];

const badges = [
  { name: 'Week Streak', description: '7 days in a row', icon: Zap, color: 'from-yellow-400 to-orange-500', earned: true },
  { name: 'Quiz Master', description: '10 perfect scores', icon: Trophy, color: 'from-violet-400 to-purple-500', earned: true },
  { name: 'Fast Learner', description: 'Complete 5 modules in 1 week', icon: Brain, color: 'from-teal-400 to-cyan-500', earned: true },
  { name: 'Night Owl', description: 'Study after midnight', icon: Target, color: 'from-blue-400 to-indigo-500', earned: false },
  { name: 'Perfectionist', description: '95%+ average', icon: Award, color: 'from-pink-400 to-rose-500', earned: false },
  { name: 'Marathon', description: '50 hours total', icon: TrendingUp, color: 'from-green-400 to-emerald-500', earned: true },
];

export function LearningInsights() {
  return (
    <div className="flex-1 bg-gradient-to-br from-white via-violet-50/20 to-teal-50/20 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Learning Insights</h1>
          <p className="text-muted-foreground">Track your progress and analyze your performance</p>
        </div>

        {/* AI Insight Banner */}
        <div className="bg-gradient-to-r from-violet-600 to-teal-500 rounded-xl p-6 text-white mb-8 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="mb-2">AI Performance Analysis</h3>
              <p className="text-white/90 mb-4">
                You're improving faster than 80% of learners in your cohort. Your consistency in Machine Learning topics is exceptional. 
                Consider tackling Deep Learning next to maximize your career trajectory.
              </p>
              <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                View Detailed Report
              </button>
            </div>
          </div>
        </div>

        {/* Performance Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Quiz Performance Trend */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-foreground mb-1">Performance Trend</h3>
                <p className="text-muted-foreground">Quiz scores over time</p>
              </div>
              <TrendingUp className="w-5 h-5 text-teal-600" />
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" stroke="#71717a" />
                <YAxis stroke="#71717a" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  fill="url(#scoreGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Skill Radar */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-foreground mb-1">Skill Analysis</h3>
                <p className="text-muted-foreground">Current vs Target levels</p>
              </div>
              <Target className="w-5 h-5 text-violet-600" />
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={skillRadarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="skill" stroke="#71717a" />
                <Radar 
                  name="Current" 
                  dataKey="current" 
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar 
                  name="Target" 
                  dataKey="target" 
                  stroke="#14b8a6" 
                  fill="#14b8a6" 
                  fillOpacity={0.1}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Study Time Analysis */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-foreground mb-1">Study Time Distribution</h3>
              <p className="text-muted-foreground">Weekly learning hours</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" stroke="#71717a" />
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
                stroke="url(#timeGradient)" 
                strokeWidth={3}
                dot={{ fill: '#14b8a6', r: 5 }}
              />
              <defs>
                <linearGradient id="timeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Achievement Badges */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-violet-600" />
            <h3 className="text-foreground">Achievements</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div 
                  key={idx} 
                  className={`p-4 rounded-xl border-2 transition-all ${
                    badge.earned 
                      ? 'border-violet-200 bg-gradient-to-br from-violet-50 to-teal-50' 
                      : 'border-gray-200 bg-gray-50 opacity-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${badge.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-foreground mb-1">{badge.name}</h4>
                  <p className="text-muted-foreground">{badge.description}</p>
                  {badge.earned && (
                    <div className="mt-2 flex items-center gap-1 text-teal-600">
                      <Award className="w-4 h-4" />
                      <span>Earned</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
