export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  country: string;
  sourceId: string;
  funnel: string;
  registrationDate: string;
  firstLoginDate?: string;
  ipAddress: string;
  deviceInfo: string;
  status: 'pending' | 'sent' | 'approved' | 'rejected' | 'deposit' | 'ftd';
  partnerId?: string;
  value?: number;
  conversionDate?: string;
  createdAt: string;
}

export interface Partner {
  id: string;
  name: string;
  apiEndpoint: string;
  apiKey: string;
  status: 'active' | 'inactive' | 'suspended';
  dealType: 'CPA' | 'CPL' | 'RevShare';
  dealValue: number;
  dailyCap?: number;
  totalCap?: number;
  currentDailySent: number;
  countries: string[];
  priority: number;
  successRate: number;
  totalLeads: number;
  totalRevenue: number;
  createdAt: string;
}

export interface Source {
  id: string;
  name: string;
  apiKey: string;
  webhookUrl: string;
  status: 'active' | 'inactive';
  totalLeads: number;
  conversionRate: number;
  createdAt: string;
}

export interface RoutingRule {
  id: string;
  name: string;
  conditions: {
    countries: string[];
    timeOfDay?: string;
    dayOfWeek?: string[];
    sourceId?: string;
  };
  partnerPriority: string[];
  fallbackAction: 'hold' | 'distribute';
  isActive: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'manager' | 'analyst' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  permissions: Permission[];
  lastLogin?: string;
  createdAt: string;
  createdBy: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'leads' | 'partners' | 'sources' | 'routing' | 'analytics' | 'admin';
  actions: ('view' | 'create' | 'edit' | 'delete')[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalLeads: number;
  totalRevenue: number;
  conversionRate: number;
  activePartners: number;
  todayLeads: number;
  todayRevenue: number;
  pendingLeads: number;
  averagePartnerResponse: number;
}

export interface AnalyticsData {
  leadsBySource: { source: string; leads: number; revenue: number }[];
  leadsByCountry: { country: string; leads: number; conversions: number }[];
  partnerPerformance: { 
    partner: string; 
    leads: number; 
    conversions: number; 
    revenue: number; 
    conversionRate: number;
    avgResponseTime: number;
  }[];
  revenueByDeal: { dealType: string; revenue: number; count: number }[];
  conversionFunnel: { stage: string; count: number; percentage: number }[];
  timeSeriesData: { 
    date: string; 
    leads: number; 
    conversions: number; 
    revenue: number; 
  }[];
  payoutCalculations: {
    partnerId: string;
    partnerName: string;
    totalLeads: number;
    conversions: number;
    dealType: 'CPA' | 'CPL' | 'RevShare';
    dealValue: number;
    calculatedPayout: number;
    revenue: number;
  }[];
}