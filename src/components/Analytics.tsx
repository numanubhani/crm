import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Globe, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Target,
  Zap,
  Award,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useCRM } from '../contexts/CRMContext';

const Analytics: React.FC = () => {
  const { analyticsData, partners, sources } = useCRM();
  const [dateRange, setDateRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  const MetricCard: React.FC<{
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, trend, icon, color }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          <div className="flex items-center space-x-1">
            {trend === 'up' ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
            <p className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {change} vs last period
            </p>
          </div>
        </div>
        <div className={`p-4 rounded-2xl ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
          <p className="text-lg text-gray-600">Comprehensive insights into your lead distribution performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value="$313,500"
          change="+15.2%"
          trend="up"
          icon={<DollarSign className="h-7 w-7 text-white" />}
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <MetricCard
          title="Total Leads"
          value="2,815"
          change="+8.7%"
          trend="up"
          icon={<Target className="h-7 w-7 text-white" />}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <MetricCard
          title="Conversion Rate"
          value="15.1%"
          change="+2.3%"
          trend="up"
          icon={<TrendingUp className="h-7 w-7 text-white" />}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <MetricCard
          title="Avg. Lead Value"
          value="$111.35"
          change="-3.1%"
          trend="down"
          icon={<Award className="h-7 w-7 text-white" />}
          color="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      {/* Revenue Trends */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Revenue & Lead Trends</h3>
            <p className="text-sm text-gray-600 mt-1">Daily performance over the selected period</p>
          </div>
          <div className="flex space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Leads</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Conversions</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={analyticsData.timeSeriesData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
            <Area type="monotone" dataKey="leads" stroke="#3B82F6" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={2} />
            <Line type="monotone" dataKey="conversions" stroke="#8B5CF6" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Partner Performance */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Partner Performance</h3>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.partnerPerformance} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" stroke="#64748b" fontSize={12} />
              <YAxis dataKey="partner" type="category" stroke="#64748b" fontSize={12} width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Sources */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Lead Sources</h3>
            <Zap className="h-5 w-5 text-yellow-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.leadsBySource}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="leads"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {analyticsData.leadsBySource.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Conversion Funnel</h3>
            <p className="text-sm text-gray-600 mt-1">Lead journey from acquisition to conversion</p>
          </div>
          <Target className="h-5 w-5 text-purple-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {analyticsData.conversionFunnel.map((stage, index) => (
            <div key={index} className="text-center">
              <div className={`mx-auto mb-4 rounded-2xl p-6 ${
                index === 0 ? 'bg-blue-100 text-blue-700' :
                index === 1 ? 'bg-indigo-100 text-indigo-700' :
                index === 2 ? 'bg-purple-100 text-purple-700' :
                index === 3 ? 'bg-green-100 text-green-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                <div className="text-3xl font-bold">{stage.count.toLocaleString()}</div>
                <div className="text-sm font-medium mt-1">{stage.percentage}%</div>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">{stage.stage}</h4>
              {index < analyticsData.conversionFunnel.length - 1 && (
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <div className="w-0 h-0 border-l-8 border-r-0 border-t-8 border-b-8 border-l-gray-300 border-t-transparent border-b-transparent"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Geographic Performance */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Geographic Performance</h3>
            <Globe className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-4">
            {analyticsData.leadsByCountry.map((country, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                    {country.country}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{country.country}</p>
                    <p className="text-sm text-gray-600">{country.leads} leads</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{country.conversions}</p>
                  <p className="text-sm text-green-600">
                    {((country.conversions / country.leads) * 100).toFixed(1)}% rate
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payout Calculations */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Payout Calculations</h3>
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-4">
            {analyticsData.payoutCalculations.slice(0, 4).map((payout, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div>
                  <p className="font-semibold text-gray-900">{payout.partnerName}</p>
                  <p className="text-sm text-gray-600">
                    {payout.dealType} • {payout.conversions} conversions
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-700">${payout.calculatedPayout.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">
                    {payout.dealType === 'RevShare' ? `${payout.dealValue}%` : `$${payout.dealValue}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue by Deal Type */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Revenue by Deal Type</h3>
          <div className="flex space-x-4 text-sm">
            {analyticsData.revenueByDeal.map((deal, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-gray-600">{deal.dealType}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData.revenueByDeal}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="dealType" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;