import { useState, useEffect } from 'react';
import { Lock, CheckCircle2, Circle } from 'lucide-react';

interface SkillNode {
  id: string;
  label: string;
  status: 'unlocked' | 'available' | 'locked';
  level: number;
  x: number;
  y: number;
  connections: string[];
  description?: string;
}

export function SkillTree() {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [skillNodes, setSkillNodes] = useState<SkillNode[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);
  const [specializations, setSpecializations] = useState<any[]>([]);
  const [showTree, setShowTree] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await import('../../data/IT.json');
        const jsonData = response.default;
        
        // Extract all specializations from both domains
        const allSpecializations: any[] = [];
        jsonData.forEach((domain: any) => {
          if (domain.children) {
            domain.children.forEach((spec: any) => {
              allSpecializations.push({
                ...spec,
                domainName: domain.name
              });
            });
          }
        });
        
        setSpecializations(allSpecializations);
      } catch (error) {
        console.error('Error loading skill tree data:', error);
      }
    };

    loadData();
  }, []);

  const convertSpecializationToNodes = (specializationData: any): SkillNode[] => {
    const nodes: SkillNode[] = [];
    
    // Add specialization as root node (level 0)
    const rootNode: SkillNode = {
      id: specializationData.id,
      label: specializationData.name.length > 15 ? specializationData.name.substring(0, 15) + '...' : specializationData.name,
      status: 'unlocked',
      level: 0,
      x: 50,
      y: 85,
      connections: [],
      description: specializationData.description || ''
    };
    nodes.push(rootNode);

    // Process abilities as level 1
    if (specializationData.children) {
      const abilities = specializationData.children;
      abilities.forEach((ability: any, index: number) => {
        const spacing = 40;
        const startX = 50 - (spacing * (abilities.length - 1)) / 2;
        const x = startX + (index * spacing);
        
        const abilityNode: SkillNode = {
          id: ability.id,
          label: ability.name.length > 12 ? ability.name.substring(0, 12) + '...' : ability.name,
          status: 'unlocked',
          level: 1,
          x: Math.max(10, Math.min(90, x)),
          y: 65,
          connections: [],
          description: ability.description || ''
        };
        nodes.push(abilityNode);
        rootNode.connections.push(ability.id);

        // Process skills as level 2
        if (ability.children) {
          const skills = ability.children;
          skills.forEach((skill: any, skillIndex: number) => {
            const skillSpacing = 25;
            const skillStartX = abilityNode.x - (skillSpacing * (skills.length - 1)) / 2;
            const skillX = skillStartX + (skillIndex * skillSpacing);
            
            const skillNode: SkillNode = {
              id: skill.id,
              label: skill.name.length > 10 ? skill.name.substring(0, 10) + '...' : skill.name,
              status: skillIndex < Math.ceil(skills.length * 0.7) ? 'available' : 'locked',
              level: 2,
              x: Math.max(5, Math.min(95, skillX)),
              y: 45,
              connections: [],
              description: skill.description || ''
            };
            nodes.push(skillNode);
            abilityNode.connections.push(skill.id);

            // Process knowledge as level 3
            if (skill.children) {
              const knowledges = skill.children;
              knowledges.forEach((knowledge: any, knowledgeIndex: any) => {
                const knowledgeSpacing = 15;
                const knowledgeStartX = skillNode.x - (knowledgeSpacing * (knowledges.length - 1)) / 2;
                const knowledgeX = knowledgeStartX + (knowledgeIndex * knowledgeSpacing);
                
                const knowledgeNode: SkillNode = {
                  id: knowledge.id,
                  label: knowledge.name.length > 8 ? knowledge.name.substring(0, 8) + '...' : knowledge.name,
                  status: knowledgeIndex < Math.ceil(knowledges.length * 0.3) ? 'available' : 'locked',
                  level: 3,
                  x: Math.max(2, Math.min(98, knowledgeX)),
                  y: 25,
                  connections: [],
                  description: knowledge.description || ''
                };
                nodes.push(knowledgeNode);
                skillNode.connections.push(knowledge.id);
              });
            }
          });
        }
      });
    }

    return nodes;
  };

  const selectSpecialization = (specId: string) => {
    const spec = specializations.find(s => s.id === specId);
    if (spec) {
      setSelectedSpecialization(specId);
      const nodes = convertSpecializationToNodes(spec);
      setSkillNodes(nodes);
      setShowTree(true);
      setSelectedNode(null);
    }
  };

  const backToSelection = () => {
    setShowTree(false);
    setSelectedSpecialization(null);
    setSelectedNode(null);
    setSkillNodes([]);
  };

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
      {!showTree ? (
        // Specialization Selection Screen
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Chọn chuyên ngành</h1>
            <p className="text-lg text-muted-foreground">
              Khám phá skill tree cho chuyên ngành bạn quan tâm
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specializations.map((spec) => (
              <button
                key={spec.id}
                onClick={() => selectSpecialization(spec.id)}
                className="group p-6 rounded-xl border-2 border-border bg-white hover:border-violet-500 hover:bg-violet-50 transition-all duration-300 text-left shadow-sm hover:shadow-md"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-xl font-bold text-white">
                      {spec.name.charAt(0)}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-violet-700">
                  {spec.name}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {spec.domainName}
                </p>
                
                {spec.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {spec.description.length > 100 ? spec.description.substring(0, 100) + '...' : spec.description}
                  </p>
                )}
                
                <div className="mt-4 inline-flex items-center text-violet-600 font-medium group-hover:text-violet-700">
                  Xem skill tree
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Skill Tree View
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <button
                onClick={backToSelection}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại chọn chuyên ngành
              </button>
              <h1 className="text-foreground mb-2">Your Skill Tree</h1>
              <p className="text-muted-foreground">Visualize your learning path and unlock new capabilities</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Tree Visualization */}
            <div className="lg:col-span-3 bg-white rounded-xl border border-border p-8 shadow-sm">
              <div className="relative w-full" style={{ height: '600px' }}>
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                  {/* Gradient definitions */}
                  <defs>
                    {skillNodes.map((node) => (
                      <linearGradient key={`${node.id}-gradient`} id={`${node.id}-gradient`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={node.status === 'unlocked' ? '#14b8a6' : node.status === 'available' ? '#8b5cf6' : '#9ca3af'} />
                        <stop offset="100%" stopColor={node.status === 'unlocked' ? '#0891b2' : node.status === 'available' ? '#7c3aed' : '#6b7280'} />
                      </linearGradient>
                    ))}
                  </defs>

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
      )}
    </div>
  );
}
