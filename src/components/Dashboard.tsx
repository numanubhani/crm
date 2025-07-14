import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  Clock, 
  AlertCircle,
  Activity,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Shield,
  CheckCircle2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useCRM } from '../contexts/CRMContext';

const Dashboard: React.FC = () => {
  const { dashboardStats, leads, partners, analyticsData } = useCRM();

  const weeklyData = [
    { day: 'Mon', leads: 45, revenue: 8250, conversions: 8 },
    { day: 'Tue', leads: 52, revenue: 9100, conversions: 12 },
    { day: 'Wed', leads: 38, revenue: 7200, conversions: 6 },
    { day: 'Thu', leads: 61, revenue: 11400, conversions: 15 },
    { day: 'Fri', leads: 48, revenue: 8900, conversions: 9 },
    { day: 'Sat', leads: 35, revenue: 6800, conversions: 7 },
    { day: 'Sun', leads: 29, revenue: 5500, conversions: 5 }
  ];

  const statusDistribution = [
    { name: 'Approved', value: leads.filter(l => l.status === 'approved').length, color: '#10B981' },
    { name: 'Pending', value: leads.filter(l => l.status === 'pending').length, color: '#F59E0B' },
    { name: 'Rejected', value: leads.filter(l => l.status === 'rejected').length, color: '#EF4444' },
    { name: 'Converted', value: leads.filter(l => l.status === 'deposit' || l.status === 'ftd').length, color: '#8B5CF6' }
  ];

  const realtimeMetrics = [
    { label: 'Leads/Hour', value: '12.4', change: '+8.2%', trend: 'up' },
    { label: 'Response Time', value: '2.3s', change: '-12%', trend: 'down' },
    { label: 'Success Rate', value: '68.5%', change: '+3.1%', trend: 'up' },
    { label: 'Active Partners', value: '8/12', change: '0%', trend: 'neutral' }
  ];

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change?: string;
    icon: React.ReactNode;
    color: string;
    trend?: 'up' | 'down' | 'neutral';
  }> = ({ title, value, change, icon, color, trend }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {change && (
            <div className="flex items-center space-x-1">
              {trend === 'up' && <ArrowUpRight className="h-4 w-4 text-green-500" />}
              {trend === 'down' && <ArrowDownRight className="h-4 w-4 text-red-500" />}
              <p className={`text-sm font-medium ${
                trend === 'up' ? 'text-green-600' : 
                trend === 'down' ? 'text-red-600' : 
                'text-gray-600'
              }`}>
                {change} from yesterday
              </p>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-2xl ${color} group-hover:scale-110 transition-transform duration-200`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const MetricCard: React.FC<{
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down' | 'neutral';
  }> = ({ label, value, change, trend }) => (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        <div className={`flex items-center space-x-1 ${
          trend === 'up' ? 'text-green-600' : 
          trend === 'down' ? 'text-red-600' : 
          'text-slate-600'
        }`}>
          {trend === 'up' && <ArrowUpRight className="h-3 w-3" />}
          {trend === 'down' && <ArrowDownRight className="h-3 w-3" />}
          <span className="text-xs font-medium">{change}</span>
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">Real-time overview of your lead distribution ecosystem</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200">
            <Activity className="h-4 w-4" />
            <span className="text-sm font-medium">All Systems Operational</span>
          </div>
          <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full border border-blue-200">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Secure</span>
          </div>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Leads Today"
          value={dashboardStats.todayLeads}
          change="+12.4%"
          trend="up"
          icon={<Target className="h-7 w-7 text-white" />}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Revenue Today"
          value={`$${dashboardStats.todayRevenue.toLocaleString()}`}
          change="+8.7%"
          trend="up"
          icon={<DollarSign className="h-7 w-7 text-white" />}
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Conversion Rate"
          value={`${dashboardStats.conversionRate}%`}
          change="+2.1%"
          trend="up"
          icon={<TrendingUp className="h-7 w-7 text-white" />}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          title="Active Partners"
          value={`${dashboardStats.activePartners}/12`}
          change="0%"
          trend="neutral"
          icon={<Users className="h-7 w-7 text-white" />}
          color="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      {/* Real-time Metrics */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Real-time Metrics</h3>
          <div className="flex items-center space-x-2 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {realtimeMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enhanced Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Weekly Performance</h3>
              <p className="text-sm text-gray-600 mt-1">Lead distribution and conversion trends</p>
            </div>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Leads</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Conversions</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Area type="monotone" dataKey="leads" stroke="#3B82F6" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={2} />
              <Area type="monotone" dataKey="conversions" stroke="#10B981" fillOpacity={1} fill="url(#colorConversions)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Enhanced Lead Status Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Lead Status Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 space-y-3">
            {statusDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partner Performance & System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Top Partners */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Top Performing Partners</h3>
            <Zap className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="space-y-4">
            {partners.slice(0, 3).map((partner, index) => (
              <div key={partner.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {partner.name.charAt(0)}
                    </div>
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-xs">👑</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">{partner.name}</p>
                    <p className="text-sm text-gray-600">{partner.totalLeads} leads • {partner.countries.length} countries</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${partner.totalRevenue.toLocaleString()}</p>
                  <div className="flex items-center space-x-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <p className="text-sm text-green-600 font-medium">{partner.successRate}% success</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced System Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">System Alerts</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">3 Active</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-yellow-800">Partner Cap Alert</p>
                <p className="text-sm text-yellow-700 mt-1">TradingPro Partners has reached 85% of daily cap (42/50 leads)</p>
                <p className="text-xs text-yellow-600 mt-2 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  2 minutes ago
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-green-800">High Performance Alert</p>
                <p className="text-sm text-green-700 mt-1">Current conversion rate is 18% above average (68.5% vs 58%)</p>
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  5 minutes ago
                </p>
              </div>
            </div>

            <div className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
              <Globe className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-blue-800">GEO Performance Update</p>
                <p className="text-sm text-blue-700 mt-1">UK traffic showing exceptional 24% conversion rate today</p>
                <p className="text-xs text-blue-600 mt-2 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  12 minutes ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;