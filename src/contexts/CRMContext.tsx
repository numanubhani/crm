import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lead, Partner, Source, RoutingRule, DashboardStats, User, Permission, Role, AnalyticsData } from '../types';

interface CRMContextType {
  leads: Lead[];
  partners: Partner[];
  sources: Source[];
  routingRules: RoutingRule[];
  users: User[];
  permissions: Permission[];
  roles: Role[];
  dashboardStats: DashboardStats;
  analyticsData: AnalyticsData;
  currentUser: User | null;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLeadStatus: (leadId: string, status: Lead['status'], partnerId?: string) => void;
  addPartner: (partner: Omit<Partner, 'id' | 'createdAt' | 'currentDailySent' | 'totalLeads' | 'totalRevenue'>) => void;
  updatePartner: (partnerId: string, updates: Partial<Partner>) => void;
  addSource: (source: Omit<Source, 'id' | 'createdAt' | 'totalLeads' | 'conversionRate'>) => void;
  addRoutingRule: (rule: Omit<RoutingRule, 'id' | 'createdAt'>) => void;
  updateRoutingRule: (ruleId: string, updates: Partial<RoutingRule>) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'createdBy'>) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  addRole: (role: Omit<Role, 'id' | 'createdAt'>) => void;
  updateRole: (roleId: string, updates: Partial<Role>) => void;
  deleteRole: (roleId: string) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [routingRules, setRoutingRules] = useState<RoutingRule[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalLeads: 0,
    totalRevenue: 0,
    conversionRate: 0,
    activePartners: 0,
    todayLeads: 0,
    todayRevenue: 0,
    pendingLeads: 0,
    averagePartnerResponse: 0
  });
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    leadsBySource: [],
    leadsByCountry: [],
    partnerPerformance: [],
    revenueByDeal: [],
    conversionFunnel: [],
    timeSeriesData: [],
    payoutCalculations: []
  });

  // Initialize with sample data
  useEffect(() => {
    const samplePermissions: Permission[] = [
      { id: 'p1', name: 'View Leads', description: 'View lead data and status', category: 'leads', actions: ['view'] },
      { id: 'p2', name: 'Manage Leads', description: 'Create, edit, and delete leads', category: 'leads', actions: ['view', 'create', 'edit', 'delete'] },
      { id: 'p3', name: 'View Partners', description: 'View partner information', category: 'partners', actions: ['view'] },
      { id: 'p4', name: 'Manage Partners', description: 'Create, edit, and delete partners', category: 'partners', actions: ['view', 'create', 'edit', 'delete'] },
      { id: 'p5', name: 'View Analytics', description: 'Access analytics and reports', category: 'analytics', actions: ['view'] },
      { id: 'p6', name: 'Manage Users', description: 'Create, edit, and delete users', category: 'admin', actions: ['view', 'create', 'edit', 'delete'] },
      { id: 'p7', name: 'Manage Routing', description: 'Create and edit routing rules', category: 'routing', actions: ['view', 'create', 'edit', 'delete'] },
      { id: 'p8', name: 'View Sources', description: 'View traffic sources', category: 'sources', actions: ['view'] },
      { id: 'p9', name: 'Manage Sources', description: 'Create, edit, and delete traffic sources', category: 'sources', actions: ['view', 'create', 'edit', 'delete'] }
    ];

    const sampleRoles: Role[] = [
      {
        id: 'r1',
        name: 'Super Admin',
        description: 'Full system access with all permissions',
        permissions: samplePermissions.map(p => p.id),
        isSystem: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'r2',
        name: 'Admin',
        description: 'Administrative access without user management',
        permissions: ['p1', 'p2', 'p3', 'p4', 'p5', 'p7', 'p8', 'p9'],
        isSystem: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'r3',
        name: 'Manager',
        description: 'Lead and partner management access',
        permissions: ['p1', 'p2', 'p3', 'p4', 'p5', 'p8'],
        isSystem: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'r4',
        name: 'Analyst',
        description: 'Read-only access with analytics',
        permissions: ['p1', 'p3', 'p5', 'p8'],
        isSystem: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'r5',
        name: 'Viewer',
        description: 'Basic read-only access',
        permissions: ['p1', 'p3', 'p8'],
        isSystem: true,
        createdAt: '2024-01-01T00:00:00Z'
      }
    ];

    const sampleUsers: User[] = [
      {
        id: 'u1',
        name: 'Admin User',
        email: 'admin@leadflow.com',
        role: 'super_admin',
        status: 'active',
        permissions: samplePermissions,
        lastLogin: '2024-01-25T10:30:00Z',
        createdAt: '2024-01-01T00:00:00Z',
        createdBy: 'system'
      },
      {
        id: 'u2',
        name: 'John Manager',
        email: 'john@leadflow.com',
        role: 'manager',
        status: 'active',
        permissions: samplePermissions.filter(p => ['p1', 'p2', 'p3', 'p4', 'p5', 'p8'].includes(p.id)),
        lastLogin: '2024-01-24T15:20:00Z',
        createdAt: '2024-01-10T00:00:00Z',
        createdBy: 'u1'
      },
      {
        id: 'u3',
        name: 'Sarah Analyst',
        email: 'sarah@leadflow.com',
        role: 'analyst',
        status: 'active',
        permissions: samplePermissions.filter(p => ['p1', 'p3', 'p5', 'p8'].includes(p.id)),
        lastLogin: '2024-01-25T09:15:00Z',
        createdAt: '2024-01-15T00:00:00Z',
        createdBy: 'u1'
      }
    ];

    const samplePartners: Partner[] = [
      {
        id: 'p1',
        name: 'TradingPro Partners',
        apiEndpoint: 'https://api.tradingpro.com/leads',
        apiKey: 'tp_api_key_123',
        status: 'active',
        dealType: 'CPA',
        dealValue: 250,
        dailyCap: 50,
        currentDailySent: 23,
        countries: ['US', 'UK', 'CA', 'AU'],
        priority: 1,
        successRate: 72.5,
        totalLeads: 1240,
        totalRevenue: 89250,
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'p2',
        name: 'ForexMax Network',
        apiEndpoint: 'https://api.forexmax.com/intake',
        apiKey: 'fm_secret_456',
        status: 'active',
        dealType: 'RevShare',
        dealValue: 35,
        dailyCap: 100,
        currentDailySent: 67,
        countries: ['DE', 'FR', 'IT', 'ES'],
        priority: 2,
        successRate: 68.2,
        totalLeads: 2130,
        totalRevenue: 156750,
        createdAt: '2024-01-20T14:30:00Z'
      },
      {
        id: 'p3',
        name: 'CryptoLeads Pro',
        apiEndpoint: 'https://api.cryptoleads.com/submit',
        apiKey: 'cl_token_789',
        status: 'active',
        dealType: 'CPL',
        dealValue: 45,
        dailyCap: 75,
        currentDailySent: 34,
        countries: ['US', 'CA', 'UK', 'AU', 'NZ'],
        priority: 3,
        successRate: 65.8,
        totalLeads: 890,
        totalRevenue: 67500,
        createdAt: '2024-01-22T11:15:00Z'
      }
    ];

    const sampleSources: Source[] = [
      {
        id: 's1',
        name: 'Facebook Ads Campaign',
        apiKey: 'fb_webhook_789',
        webhookUrl: 'https://ourcrm.com/api/leads/facebook',
        status: 'active',
        totalLeads: 890,
        conversionRate: 12.4,
        createdAt: '2024-01-10T09:00:00Z'
      },
      {
        id: 's2',
        name: 'Google Ads Traffic',
        apiKey: 'ga_webhook_101',
        webhookUrl: 'https://ourcrm.com/api/leads/google',
        status: 'active',
        totalLeads: 1250,
        conversionRate: 15.7,
        createdAt: '2024-01-12T11:15:00Z'
      },
      {
        id: 's3',
        name: 'Native Ads Network',
        apiKey: 'na_webhook_202',
        webhookUrl: 'https://ourcrm.com/api/leads/native',
        status: 'active',
        totalLeads: 675,
        conversionRate: 9.8,
        createdAt: '2024-01-18T14:20:00Z'
      }
    ];

    const sampleLeads: Lead[] = [
      {
        id: 'l1',
        name: 'John Smith',
        phone: '+1-555-0123',
        email: 'john.smith@email.com',
        country: 'US',
        sourceId: 's1',
        funnel: 'trading-signup',
        registrationDate: '2024-01-25T10:30:00Z',
        firstLoginDate: '2024-01-25T11:45:00Z',
        ipAddress: '192.168.1.100',
        deviceInfo: 'Chrome/Mac',
        status: 'deposit',
        partnerId: 'p1',
        value: 250,
        conversionDate: '2024-01-26T09:20:00Z',
        createdAt: '2024-01-25T10:30:00Z'
      },
      {
        id: 'l2',
        name: 'Sarah Johnson',
        phone: '+44-20-7946-0958',
        email: 'sarah.j@email.com',
        country: 'UK',
        sourceId: 's2',
        funnel: 'forex-landing',
        registrationDate: '2024-01-25T14:20:00Z',
        ipAddress: '192.168.1.101',
        deviceInfo: 'Safari/iPhone',
        status: 'sent',
        partnerId: 'p1',
        createdAt: '2024-01-25T14:20:00Z'
      },
      {
        id: 'l3',
        name: 'Michael Brown',
        phone: '+49-30-12345678',
        email: 'michael.b@email.com',
        country: 'DE',
        sourceId: 's3',
        funnel: 'crypto-funnel',
        registrationDate: '2024-01-25T16:45:00Z',
        ipAddress: '192.168.1.102',
        deviceInfo: 'Firefox/Windows',
        status: 'approved',
        partnerId: 'p2',
        createdAt: '2024-01-25T16:45:00Z'
      },
      {
        id: 'l4',
        name: 'Emma Wilson',
        phone: '+1-555-0456',
        email: 'emma.w@email.com',
        country: 'CA',
        sourceId: 's1',
        funnel: 'trading-signup',
        registrationDate: '2024-01-25T18:10:00Z',
        ipAddress: '192.168.1.103',
        deviceInfo: 'Chrome/Android',
        status: 'ftd',
        partnerId: 'p3',
        value: 500,
        conversionDate: '2024-01-26T12:30:00Z',
        createdAt: '2024-01-25T18:10:00Z'
      }
    ];

    setPermissions(samplePermissions);
    setRoles(sampleRoles);
    setUsers(sampleUsers);
    setCurrentUser(sampleUsers[0]);
    setPartners(samplePartners);
    setSources(sampleSources);
    setLeads(sampleLeads);

    // Calculate dashboard stats
    setDashboardStats({
      totalLeads: sampleLeads.length,
      totalRevenue: samplePartners.reduce((sum, p) => sum + p.totalRevenue, 0),
      conversionRate: 14.2,
      activePartners: samplePartners.filter(p => p.status === 'active').length,
      todayLeads: sampleLeads.filter(l => l.createdAt.startsWith('2024-01-25')).length,
      todayRevenue: 750,
      pendingLeads: sampleLeads.filter(l => l.status === 'pending').length,
      averagePartnerResponse: 2.3
    });

    // Calculate analytics data
    setAnalyticsData({
      leadsBySource: [
        { source: 'Facebook Ads', leads: 890, revenue: 45000 },
        { source: 'Google Ads', leads: 1250, revenue: 78500 },
        { source: 'Native Ads', leads: 675, revenue: 32000 }
      ],
      leadsByCountry: [
        { country: 'US', leads: 450, conversions: 68 },
        { country: 'UK', leads: 320, conversions: 45 },
        { country: 'DE', leads: 280, conversions: 38 },
        { country: 'CA', leads: 190, conversions: 29 }
      ],
      partnerPerformance: samplePartners.map(p => ({
        partner: p.name,
        leads: p.totalLeads,
        conversions: Math.floor(p.totalLeads * (p.successRate / 100)),
        revenue: p.totalRevenue,
        conversionRate: p.successRate,
        avgResponseTime: Math.random() * 5 + 1
      })),
      revenueByDeal: [
        { dealType: 'CPA', revenue: 89250, count: 357 },
        { dealType: 'RevShare', revenue: 156750, count: 1456 },
        { dealType: 'CPL', revenue: 67500, count: 1500 }
      ],
      conversionFunnel: [
        { stage: 'Leads Received', count: 2815, percentage: 100 },
        { stage: 'Sent to Partners', count: 2650, percentage: 94.1 },
        { stage: 'Approved', count: 1890, percentage: 67.1 },
        { stage: 'Deposited', count: 425, percentage: 15.1 },
        { stage: 'FTD', count: 180, percentage: 6.4 }
      ],
      timeSeriesData: [
        { date: '2024-01-19', leads: 45, conversions: 8, revenue: 2250 },
        { date: '2024-01-20', leads: 52, conversions: 12, revenue: 3100 },
        { date: '2024-01-21', leads: 38, conversions: 6, revenue: 1800 },
        { date: '2024-01-22', leads: 61, conversions: 15, revenue: 4200 },
        { date: '2024-01-23', leads: 48, conversions: 9, revenue: 2700 },
        { date: '2024-01-24', leads: 55, conversions: 11, revenue: 3300 },
        { date: '2024-01-25', leads: 67, conversions: 14, revenue: 4100 }
      ],
      payoutCalculations: samplePartners.map(p => ({
        partnerId: p.id,
        partnerName: p.name,
        totalLeads: p.totalLeads,
        conversions: Math.floor(p.totalLeads * (p.successRate / 100)),
        dealType: p.dealType,
        dealValue: p.dealValue,
        calculatedPayout: p.dealType === 'CPA' 
          ? Math.floor(p.totalLeads * (p.successRate / 100)) * p.dealValue
          : p.dealType === 'CPL'
          ? p.totalLeads * p.dealValue
          : p.totalRevenue * (p.dealValue / 100),
        revenue: p.totalRevenue
      }))
    });
  }, []);

  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `l${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setLeads(prev => [...prev, newLead]);
  };

  const updateLeadStatus = (leadId: string, status: Lead['status'], partnerId?: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, status, partnerId, conversionDate: status === 'deposit' || status === 'ftd' ? new Date().toISOString() : lead.conversionDate }
        : lead
    ));
  };

  const addPartner = (partnerData: Omit<Partner, 'id' | 'createdAt' | 'currentDailySent' | 'totalLeads' | 'totalRevenue'>) => {
    const newPartner: Partner = {
      ...partnerData,
      id: `p${Date.now()}`,
      currentDailySent: 0,
      totalLeads: 0,
      totalRevenue: 0,
      createdAt: new Date().toISOString()
    };
    setPartners(prev => [...prev, newPartner]);
  };

  const updatePartner = (partnerId: string, updates: Partial<Partner>) => {
    setPartners(prev => prev.map(partner => 
      partner.id === partnerId ? { ...partner, ...updates } : partner
    ));
  };

  const addSource = (sourceData: Omit<Source, 'id' | 'createdAt' | 'totalLeads' | 'conversionRate'>) => {
    const newSource: Source = {
      ...sourceData,
      id: `s${Date.now()}`,
      totalLeads: 0,
      conversionRate: 0,
      createdAt: new Date().toISOString()
    };
    setSources(prev => [...prev, newSource]);
  };

  const addRoutingRule = (ruleData: Omit<RoutingRule, 'id' | 'createdAt'>) => {
    const newRule: RoutingRule = {
      ...ruleData,
      id: `r${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setRoutingRules(prev => [...prev, newRule]);
  };

  const updateRoutingRule = (ruleId: string, updates: Partial<RoutingRule>) => {
    setRoutingRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, ...updates } : rule
    ));
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt' | 'createdBy'>) => {
    const newUser: User = {
      ...userData,
      id: `u${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.id || 'system'
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const addRole = (roleData: Omit<Role, 'id' | 'createdAt'>) => {
    const newRole: Role = {
      ...roleData,
      id: `r${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setRoles(prev => [...prev, newRole]);
  };

  const updateRole = (roleId: string, updates: Partial<Role>) => {
    setRoles(prev => prev.map(role => 
      role.id === roleId ? { ...role, ...updates } : role
    ));
  };

  const deleteRole = (roleId: string) => {
    setRoles(prev => prev.filter(role => role.id !== roleId));
  };

  return (
    <CRMContext.Provider value={{
      leads,
      partners,
      sources,
      routingRules,
      users,
      permissions,
      roles,
      dashboardStats,
      analyticsData,
      currentUser,
      addLead,
      updateLeadStatus,
      addPartner,
      updatePartner,
      addSource,
      addRoutingRule,
      updateRoutingRule,
      addUser,
      updateUser,
      deleteUser,
      addRole,
      updateRole,
      deleteRole
    }}>
      {children}
    </CRMContext.Provider>
  );
};