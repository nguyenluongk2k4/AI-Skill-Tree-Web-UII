import { useState, useEffect, useRef } from 'react';
import { Lock, CheckCircle2, Circle } from 'lucide-react';

interface SkillNode {
  id: string;
  label: string;
  fullName: string; // Added for full name display
  status: 'unlocked' | 'available' | 'locked';
  level: number;
  x: number;
  y: number;
  connections: string[];
  description?: string;
  parentId?: string; // Added for hierarchical navigation
}

export function SkillTree() {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [skillNodes, setSkillNodes] = useState<SkillNode[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);
  const [specializations, setSpecializations] = useState<any[]>([]);
  const [showTree, setShowTree] = useState(false);
  const [visibleNodeIds, setVisibleNodeIds] = useState<Set<string>>(new Set());
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipX, setTooltipX] = useState(0);
  const [tooltipY, setTooltipY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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
      fullName: specializationData.name,
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
          fullName: ability.name,
          status: 'unlocked',
          level: 1,
          x: Math.max(10, Math.min(90, x)),
          y: 65,
          connections: [],
          description: ability.description || '',
          parentId: rootNode.id
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
              fullName: skill.name,
              status: skillIndex < Math.ceil(skills.length * 0.7) ? 'available' : 'locked',
              level: 2,
              x: Math.max(5, Math.min(95, skillX)),
              y: 45,
              connections: [],
              description: skill.description || '',
              parentId: abilityNode.id
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
                  fullName: knowledge.name,
                  status: knowledgeIndex < Math.ceil(knowledges.length * 0.3) ? 'available' : 'locked',
                  level: 3,
                  x: Math.max(2, Math.min(98, knowledgeX)),
                  y: 25,
                  connections: [],
                  description: knowledge.description || '',
                  parentId: skillNode.id
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

  const handleNodeClick = (clickedNode: SkillNode) => {
    setSelectedNode(clickedNode);
    const newVisibleNodeIds = new Set<string>();
    const allNodesMap = new Map<string, SkillNode>();
    skillNodes.forEach(node => allNodesMap.set(node.id, node));

    // Collect ancestors in correct order (từ gốc xuống node được click)
    const ancestors: SkillNode[] = [];
    let currentNode: SkillNode | undefined = clickedNode;
    while (currentNode) {
      ancestors.unshift(currentNode); // Thêm vào đầu mảng để có thứ tự từ gốc xuống
      newVisibleNodeIds.add(currentNode.id);
      if (currentNode.parentId) {
        currentNode = allNodesMap.get(currentNode.parentId);
      } else {
        currentNode = undefined;
      }
    }

    // Collect and add children if expanding
    const children: SkillNode[] = [];
    const knowledgeNodes: SkillNode[] = [];

    if (visibleNodeIds.has(clickedNode.id)) {
      // Get direct children
      const directChildren = skillNodes.filter(node => node.parentId === clickedNode.id);
      directChildren.forEach(child => {
        children.push(child);
        newVisibleNodeIds.add(child.id);
      });

      // If clicked node is a skill (level 2), show its knowledge nodes
      if (clickedNode.level === 2) {
        const childKnowledge = skillNodes.filter(node => node.parentId === clickedNode.id);
        childKnowledge.forEach(knowledge => {
          knowledgeNodes.push(knowledge);
          newVisibleNodeIds.add(knowledge.id);
        });
      }
    }

    // Calculate positions for visible nodes
    const verticalSpacing = 15; // Khoảng cách giữa các node dọc
    const horizontalSpacing = 20; // Khoảng cách giữa các node ngang
    const startY = 85; // Vị trí bắt đầu từ trên xuống
    
    // Update positions for all visible nodes
    const updatedNodes = skillNodes.map(node => {
      if (newVisibleNodeIds.has(node.id)) {
        // Nếu là node tổ tiên (bao gồm cả node được click)
        if (ancestors.find(n => n.id === node.id)) {
          const index = ancestors.findIndex(n => n.id === node.id);
          return {
            ...node,
            x: 50, // Căn giữa theo chiều ngang
            y: startY - (index * verticalSpacing), // Sắp xếp từ trên xuống dưới
          };
        }
        // Nếu là node con (ability hoặc skill)
        else if (children.find(n => n.id === node.id)) {
          const childIndex = children.findIndex(n => n.id === node.id);
          const totalChildren = children.length;
          const startX = 50 - ((totalChildren - 1) * horizontalSpacing) / 2;
          return {
            ...node,
            x: startX + (childIndex * horizontalSpacing), // Phân bố đều theo chiều ngang
            y: startY - ((ancestors.length - 1) * verticalSpacing) - verticalSpacing, // Đặt dưới node cha
          };
        }
        // Nếu là knowledge node
        else if (knowledgeNodes.find(n => n.id === node.id)) {
          const parentSkill = clickedNode.level === 2 ? clickedNode : undefined;
          if (parentSkill) {
            const knowledgeIndex = knowledgeNodes.findIndex(n => n.id === node.id);
            const totalKnowledge = knowledgeNodes.length;
            const knowledgeStartX = parentSkill.x - ((totalKnowledge - 1) * (horizontalSpacing * 0.7)) / 2;
            return {
              ...node,
              x: knowledgeStartX + (knowledgeIndex * horizontalSpacing * 0.7), // Phân bố đều dưới skill node, khoảng cách nhỏ hơn
              y: startY - ((ancestors.length - 1) * verticalSpacing) - (verticalSpacing * 2), // Thêm một tầng dưới skill nodes
            };
          }
        }
      }
      return node;
    });

    setSkillNodes(updatedNodes);
    setVisibleNodeIds(newVisibleNodeIds);
  };

  const selectSpecialization = (specId: string) => {
    const spec = specializations.find(s => s.id === specId);
    if (spec) {
      setSelectedSpecialization(specId);
      const nodes = convertSpecializationToNodes(spec);
      setSkillNodes(nodes);
      setShowTree(true);
      setSelectedNode(null);
      setVisibleNodeIds(new Set([spec.id])); // Only show the root node initially
    }
  };

  const backToSelection = () => {
    setShowTree(false);
    setSelectedSpecialization(null);
    setSelectedNode(null);
    setSkillNodes([]);
    setVisibleNodeIds(new Set());
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
    <div ref={containerRef} className="flex-1 bg-gradient-to-br from-white via-violet-50/20 to-teal-50/20 p-8 overflow-auto relative">
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
                  {skillNodes.filter(node => visibleNodeIds.has(node.id)).map((node) =>
                    node.connections.filter(targetId => visibleNodeIds.has(targetId)).map((targetId) => {
                      const target = skillNodes.find((n) => n.id === targetId);
                      if (!target) return null;
                      
                      const isUnlocked = node.status === 'unlocked' && (target.status === 'unlocked' || target.status === 'available');
                      
                      // Draw straight lines between parent and child nodes
                      return (
                        <line
                          key={`${node.id}-${targetId}`}
                          x1={node.x}
                          y1={node.y + 3} // Offset from bottom of parent node
                          x2={target.x}
                          y2={target.y - 3} // Offset from top of child node
                          stroke={isUnlocked ? '#8b5cf6' : '#d4d4d8'}
                          strokeWidth="0.3"
                          strokeDasharray={isUnlocked ? '0' : '1,1'}
                          opacity={isUnlocked ? 0.6 : 0.3}
                        />
                      );
                    })
                  )}

                  {/* Skill Nodes */}
                  {skillNodes.filter(node => visibleNodeIds.has(node.id)).map((node) => {
                    const Icon = getStatusIcon(node.status);
                    const isSelected = selectedNode?.id === node.id;
                    
                    return (
                      <g
                        key={node.id}
                        transform={`translate(${node.x}, ${node.y})`}
                        onClick={() => handleNodeClick(node)}
                        onMouseEnter={(e) => {
                          if (containerRef.current) {
                            const containerRect = containerRef.current.getBoundingClientRect();
                            setShowTooltip(true);
                            setTooltipContent(node.fullName);
                            setTooltipX(e.clientX - containerRect.left + 10);
                            setTooltipY(e.clientY - containerRect.top + 10);
                          }
                        }}
                        onMouseLeave={() => setShowTooltip(false)}
                        className="cursor-pointer"
                        style={{ transition: 'transform 0.2s' }}
                      >
                        <title>{node.fullName}</title>
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
                  <h3 className="text-foreground mb-2">{selectedNode.fullName}</h3>
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
                  <h3 className="text-foreground mb-2">{selectedNode.fullName}</h3>
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

      {showTooltip && (
        <div
          className="absolute z-50 px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-90 dark:bg-gray-700"
          style={{ left: tooltipX, top: tooltipY, pointerEvents: 'none' }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
}
