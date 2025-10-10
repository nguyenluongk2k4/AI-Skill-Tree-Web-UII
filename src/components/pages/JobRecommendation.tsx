import { Briefcase, MapPin, DollarSign, TrendingUp, ExternalLink } from 'lucide-react';
import { Progress } from '../ui/progress';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  match: number;
  requiredSkills: string[];
  missingSkills: string[];
}

const jobs: Job[] = [
  {
    id: '1',
    title: 'Machine Learning Engineer',
    company: 'TechCorp AI',
    location: 'San Francisco, CA',
    salary: '$140k - $180k',
    match: 87,
    requiredSkills: ['Python', 'ML Fundamentals', 'Data Analysis', 'Algorithms'],
    missingSkills: ['Deep Learning', 'MLOps']
  },
  {
    id: '2',
    title: 'Data Scientist',
    company: 'DataFlow Inc',
    location: 'Remote',
    salary: '$120k - $160k',
    match: 82,
    requiredSkills: ['Python', 'Data Analysis', 'ML Fundamentals'],
    missingSkills: ['NLP', 'Cloud Architecture']
  },
  {
    id: '3',
    title: 'AI Research Scientist',
    company: 'Innovation Labs',
    location: 'Boston, MA',
    salary: '$160k - $220k',
    match: 65,
    requiredSkills: ['Algorithms', 'ML Fundamentals'],
    missingSkills: ['Deep Learning', 'NLP', 'AI Research']
  },
  {
    id: '4',
    title: 'Backend Engineer',
    company: 'CloudScale',
    location: 'Austin, TX',
    salary: '$130k - $170k',
    match: 78,
    requiredSkills: ['Python', 'Algorithms', 'System Design'],
    missingSkills: ['Cloud Architecture', 'MLOps']
  },
  {
    id: '5',
    title: 'Analytics Engineer',
    company: 'DataViz Solutions',
    location: 'New York, NY',
    salary: '$110k - $150k',
    match: 91,
    requiredSkills: ['Python', 'Data Analysis', 'Algorithms'],
    missingSkills: ['Data Viz']
  },
];

const suggestedSkills = [
  { name: 'Deep Learning', impact: 'High', jobs: 12 },
  { name: 'Cloud Architecture', impact: 'High', jobs: 18 },
  { name: 'MLOps', impact: 'Medium', jobs: 8 },
  { name: 'NLP', impact: 'Medium', jobs: 10 },
  { name: 'Data Visualization', impact: 'Low', jobs: 6 },
];

export function JobRecommendation() {
  return (
    <div className="flex-1 bg-gradient-to-br from-white via-violet-50/20 to-teal-50/20 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Career Opportunities</h1>
          <p className="text-muted-foreground">Discover roles that match your skill set</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Job Listings */}
          <div className="lg:col-span-2 space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-foreground mb-1">{job.title}</h3>
                    <p className="text-muted-foreground mb-3">{job.company}</p>
                    
                    <div className="flex flex-wrap gap-4 text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>{job.salary}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className={`inline-block px-3 py-1 rounded-full mb-2 ${
                      job.match >= 80 ? 'bg-teal-100 text-teal-700' : 
                      job.match >= 70 ? 'bg-violet-100 text-violet-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {job.match}% Match
                    </div>
                  </div>
                </div>

                {/* Match Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Skill Alignment</span>
                  </div>
                  <Progress value={job.match} className="h-2" />
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <p className="text-muted-foreground mb-2">Your Matching Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {job.missingSkills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-muted-foreground mb-2">Skills to Develop:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.missingSkills.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button className="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors">
                  View Details <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Sidebar - Suggested Skills */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-violet-600" />
                <h3 className="text-foreground">Suggested Skills</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Learning these skills will unlock more opportunities
              </p>
              
              <div className="space-y-4">
                {suggestedSkills.map((skill, idx) => (
                  <div key={idx} className="pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-foreground mb-1">{skill.name}</h4>
                        <p className="text-muted-foreground">
                          {skill.jobs} matching jobs
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        skill.impact === 'High' ? 'bg-teal-100 text-teal-700' :
                        skill.impact === 'Medium' ? 'bg-violet-100 text-violet-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {skill.impact} Impact
                      </span>
                    </div>
                    <button className="text-violet-600 hover:text-violet-700 transition-colors">
                      Add to Learning Path
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Insights */}
            <div className="bg-gradient-to-br from-violet-50 to-teal-50 rounded-xl border border-violet-200 p-6">
              <Briefcase className="w-8 h-8 text-violet-600 mb-3" />
              <h4 className="text-foreground mb-2">Career Insight</h4>
              <p className="text-muted-foreground">
                You're in the top 15% of learners in your field. Focus on Deep Learning to unlock senior positions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
