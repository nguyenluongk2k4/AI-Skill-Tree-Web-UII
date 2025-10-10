import { useState } from 'react';
import { Lock, CheckCircle2, Circle } from 'lucide-react';

interface SkillNode {
  id: string;
  label: string;
  status: 'unlocked' | 'available' | 'locked';
  level: number;
  x: number;
  y: number;
  connections: string[];
}

const skillNodes: SkillNode[] = [
  // Level 0 - Foundation
  { id: 'programming', label: 'Programming Basics', status: 'unlocked', level: 0, x: 50, y: 85, connections: ['python', 'algorithms'] },
  
  // Level 1 - Core Skills
  { id: 'python', label: 'Python', status: 'unlocked', level: 1, x: 30, y: 65, connections: ['data-analysis', 'ml-basics'] },
  { id: 'algorithms', label: 'Algorithms', status: 'unlocked', level: 1, x: 70, y: 65, connections: ['ml-basics', 'systems'] },
  
  // Level 2 - Specialization
  { id: 'data-analysis', label: 'Data Analysis', status: 'unlocked', level: 2, x: 20, y: 45, connections: ['ml-basics', 'visualization'] },
  { id: 'ml-basics', label: 'ML Fundamentals', status: 'available', level: 2, x: 50, y: 45, connections: ['deep-learning', 'nlp'] },
  { id: 'systems', label: 'System Design', status: 'available', level: 2, x: 80, y: 45, connections: ['cloud', 'deep-learning'] },
  
  // Level 3 - Advanced
  { id: 'visualization', label: 'Data Viz', status: 'locked', level: 3, x: 15, y: 25, connections: ['ml-ops'] },
  { id: 'deep-learning', label: 'Deep Learning', status: 'locked', level: 3, x: 50, y: 25, connections: ['ml-ops', 'ai-research'] },
  { id: 'nlp', label: 'NLP', status: 'locked', level: 3, x: 65, y: 25, connections: ['ai-research'] },
  { id: 'cloud', label: 'Cloud Architecture', status: 'locked', level: 3, x: 85, y: 25, connections: ['ml-ops'] },
  
  // Level 4 - Expert
  { id: 'ml-ops', label: 'MLOps', status: 'locked', level: 4, x: 35, y: 5, connections: [] },
  { id: 'ai-research', label: 'AI Research', status: 'locked', level: 4, x: 65, y: 5, connections: [] },
];

export function SkillTree() {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unlocked':
        return 'from-teal-400 to-teal-600';
      case 'available':
        return 'from-violet-400 to-violet-600';
      default:
        return 'from-gray-300 to-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unlocked':
        return CheckCircle2;
      case 'available':
        return Circle;
      default:
        return Lock;
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-white via-violet-50/20 to-teal-50/20 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Your Skill Tree</h1>
          <p className="text-muted-foreground">Visualize your learning path and unlock new capabilities</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Tree Visualization */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-border p-8 shadow-sm">
            <div className="relative w-full" style={{ height: '600px' }}>
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                {/* Connection Lines */}
                {skillNodes.map((node) =>
                  node.connections.map((targetId) => {
                    const target = skillNodes.find((n) => n.id === targetId);
                    if (!target) return null;
                    
                    const isUnlocked = node.status === 'unlocked' && (target.status === 'unlocked' || target.status === 'available');
                    
                    return (
                      <line
                        key={`${node.id}-${targetId}`}
                        x1={node.x}
                        y1={node.y}
                        x2={target.x}
                        y2={target.y}
                        stroke={isUnlocked ? '#8b5cf6' : '#d4d4d8'}
                        strokeWidth="0.3"
                        strokeDasharray={isUnlocked ? '0' : '1,1'}
                        opacity={isUnlocked ? 0.6 : 0.3}
                      />
                    );
                  })
                )}

                {/* Skill Nodes */}
                {skillNodes.map((node) => {
                  const Icon = getStatusIcon(node.status);
                  const isSelected = selectedNode?.id === node.id;
                  
                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onClick={() => setSelectedNode(node)}
                      className="cursor-pointer"
                      style={{ transition: 'transform 0.2s' }}
                    >
                      {/* Outer ring for selected */}
                      {isSelected && (
                        <circle
                          r="4"
                          fill="none"
                          stroke="#8b5cf6"
                          strokeWidth="0.4"
                          opacity="0.5"
                        />
                      )}
                      
                      {/* Node circle */}
                      <circle
                        r="3"
                        fill={`url(#${node.id}-gradient)`}
                        className={`${node.status !== 'locked' ? 'hover:opacity-80' : ''} transition-opacity`}
                      />
                      
                      {/* Label */}
                      <text
                        y="5.5"
                        textAnchor="middle"
                        className="pointer-events-none select-none"
                        style={{ fontSize: '2.5px', fill: '#3f3f46' }}
                      >
                        {node.label}
                      </text>

                      {/* Gradient definition */}
                      <defs>
                        <linearGradient id={`${node.id}-gradient`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={node.status === 'unlocked' ? '#14b8a6' : node.status === 'available' ? '#8b5cf6' : '#9ca3af'} />
                          <stop offset="100%" stopColor={node.status === 'unlocked' ? '#0891b2' : node.status === 'available' ? '#7c3aed' : '#6b7280'} />
                        </linearGradient>
                      </defs>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Skill Details Sidebar */}
          <div className="space-y-6">
            {selectedNode ? (
              <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getStatusColor(selectedNode.status)} flex items-center justify-center mb-4`}>
                  {(() => {
                    const Icon = getStatusIcon(selectedNode.status);
                    return <Icon className="w-6 h-6 text-white" />;
                  })()}
                </div>
                <h3 className="text-foreground mb-2">{selectedNode.label}</h3>
                <p className="text-muted-foreground mb-4">
                  {selectedNode.status === 'unlocked' && 'Completed - Well done!'}
                  {selectedNode.status === 'available' && 'Ready to learn - Start now!'}
                  {selectedNode.status === 'locked' && 'Locked - Complete prerequisites first'}
                </p>
                
                {selectedNode.status === 'available' && (
                  <button className="w-full bg-gradient-to-r from-violet-600 to-teal-500 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">
                    Start Learning
                  </button>
                )}
                
                {selectedNode.status === 'unlocked' && (
                  <button className="w-full border border-border text-foreground py-2 px-4 rounded-lg hover:bg-accent transition-colors">
                    Review Content
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
                <p className="text-muted-foreground text-center">
                  Select a node to view details
                </p>
              </div>
            )}

            {/* Legend */}
            <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
              <h4 className="text-foreground mb-4">Legend</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-teal-400 to-teal-600"></div>
                  <span className="text-muted-foreground">Unlocked</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-violet-400 to-violet-600"></div>
                  <span className="text-muted-foreground">Available</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
                  <span className="text-muted-foreground">Locked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
