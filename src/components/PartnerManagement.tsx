import React, { useState } from 'react';
import { Plus, Edit, Trash2, Globe, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useCRM } from '../contexts/CRMContext';
import { Partner } from '../types';

const PartnerManagement: React.FC = () => {
  const { partners, addPartner, updatePartner } = useCRM();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  const getStatusColor = (status: Partner['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDealTypeColor = (dealType: Partner['dealType']) => {
    switch (dealType) {
      case 'CPA': return 'bg-blue-100 text-blue-800';
      case 'CPL': return 'bg-purple-100 text-purple-800';
      case 'RevShare': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const PartnerModal: React.FC<{
    partner?: Partner;
    onClose: () => void;
    onSave: (partnerData: any) => void;
  }> = ({ partner, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      name: partner?.name || '',
      apiEndpoint: partner?.apiEndpoint || '',
      apiKey: partner?.apiKey || '',
      status: partner?.status || 'active',
      dealType: partner?.dealType || 'CPA',
      dealValue: partner?.dealValue || 0,
      dailyCap: partner?.dailyCap || undefined,
      totalCap: partner?.totalCap || undefined,
      countries: partner?.countries || [],
      priority: partner?.priority || 1,
      successRate: partner?.successRate || 0
    });

    const [newCountry, setNewCountry] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
      onClose();
    };

    const addCountry = () => {
      if (newCountry && !formData.countries.includes(newCountry)) {
        setFormData(prev => ({
          ...prev,
          countries: [...prev.countries, newCountry]
        }));
        setNewCountry('');
      }
    };

    const removeCountry = (country: string) => {
      setFormData(prev => ({
        ...prev,
        countries: prev.countries.filter(c => c !== country)
      }));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {partner ? 'Edit Partner' : 'Add New Partner'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Partner Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Partner['status'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Endpoint</label>
              <input
                type="url"
                value={formData.apiEndpoint}
                onChange={(e) => setFormData(prev => ({ ...prev, apiEndpoint: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://api.partner.com/leads"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
              <input
                type="password"
                value={formData.apiKey}
                onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deal Type</label>
                <select
                  value={formData.dealType}
                  onChange={(e) => setFormData(prev => ({ ...prev, dealType: e.target.value as Partner['dealType'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="CPA">CPA</option>
                  <option value="CPL">CPL</option>
                  <option value="RevShare">RevShare</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deal Value {formData.dealType === 'RevShare' ? '(%)' : '($)'}
                </label>
                <input
                  type="number"
                  value={formData.dealValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, dealValue: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Cap (optional)</label>
                <input
                  type="number"
                  value={formData.dailyCap || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, dailyCap: e.target.value ? Number(e.target.value) : undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Cap (optional)</label>
                <input
                  type="number"
                  value={formData.totalCap || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalCap: e.target.value ? Number(e.target.value) : undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Supported Countries</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value.toUpperCase())}
                  placeholder="e.g., US, UK, CA"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={2}
                />
                <button
                  type="button"
                  onClick={addCountry}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.countries.map(country => (
                  <span
                    key={country}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {country}
                    <button
                      type="button"
                      onClick={() => removeCountry(country)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {partner ? 'Update Partner' : 'Add Partner'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partner Management</h1>
          <p className="text-gray-600 mt-1">Manage your affiliate and brand partners</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Partner
        </button>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <div key={partner.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {partner.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(partner.status)}`}>
                    {partner.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {partner.status === 'suspended' && <AlertCircle className="h-3 w-3 mr-1" />}
                    {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingPartner(partner)}
                  className="text-gray-400 hover:text-blue-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Deal Type</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDealTypeColor(partner.dealType)}`}>
                  {partner.dealType}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Deal Value</span>
                <span className="text-sm font-medium text-gray-900">
                  {partner.dealType === 'RevShare' ? `${partner.dealValue}%` : `$${partner.dealValue}`}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="text-sm font-medium text-green-600">{partner.successRate}%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Priority</span>
                <span className="text-sm font-medium text-gray-900">#{partner.priority}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Daily Cap Progress</span>
                <span className="text-xs text-gray-500">
                  {partner.currentDailySent}/{partner.dailyCap || '∞'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: partner.dailyCap 
                      ? `${Math.min((partner.currentDailySent / partner.dailyCap) * 100, 100)}%`
                      : '0%'
                  }}
                ></div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{partner.totalLeads}</div>
                  <div className="text-xs text-gray-500">Total Leads</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">${partner.totalRevenue.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Revenue</div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1">
              {partner.countries.slice(0, 4).map(country => (
                <span key={country} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  <Globe className="h-3 w-3 mr-1" />
                  {country}
                </span>
              ))}
              {partner.countries.length > 4 && (
                <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  +{partner.countries.length - 4}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Partner Modal */}
      {showAddModal && (
        <PartnerModal
          onClose={() => setShowAddModal(false)}
          onSave={(partnerData) => addPartner(partnerData)}
        />
      )}

      {/* Edit Partner Modal */}
      {editingPartner && (
        <PartnerModal
          partner={editingPartner}
          onClose={() => setEditingPartner(null)}
          onSave={(partnerData) => {
            updatePartner(editingPartner.id, partnerData);
            setEditingPartner(null);
          }}
        />
      )}
    </div>
  );
};

export default PartnerManagement;