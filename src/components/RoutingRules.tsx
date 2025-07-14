import React, { useState } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Clock, Globe, Users } from 'lucide-react';
import { useCRM } from '../contexts/CRMContext';
import { RoutingRule } from '../types';

const RoutingRules: React.FC = () => {
  const { routingRules, partners, sources, addRoutingRule, updateRoutingRule } = useCRM();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRule, setEditingRule] = useState<RoutingRule | null>(null);

  const RuleModal: React.FC<{
    rule?: RoutingRule;
    onClose: () => void;
    onSave: (ruleData: any) => void;
  }> = ({ rule, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      name: rule?.name || '',
      conditions: {
        countries: rule?.conditions.countries || [],
        timeOfDay: rule?.conditions.timeOfDay || '',
        dayOfWeek: rule?.conditions.dayOfWeek || [],
        sourceId: rule?.conditions.sourceId || ''
      },
      partnerPriority: rule?.partnerPriority || [],
      fallbackAction: rule?.fallbackAction || 'hold',
      isActive: rule?.isActive ?? true
    });

    const [newCountry, setNewCountry] = useState('');
    const [selectedDays, setSelectedDays] = useState(new Set(formData.conditions.dayOfWeek));

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({
        ...formData,
        conditions: {
          ...formData.conditions,
          dayOfWeek: Array.from(selectedDays)
        }
      });
      onClose();
    };

    const addCountry = () => {
      if (newCountry && !formData.conditions.countries.includes(newCountry)) {
        setFormData(prev => ({
          ...prev,
          conditions: {
            ...prev.conditions,
            countries: [...prev.conditions.countries, newCountry]
          }
        }));
        setNewCountry('');
      }
    };

    const removeCountry = (country: string) => {
      setFormData(prev => ({
        ...prev,
        conditions: {
          ...prev.conditions,
          countries: prev.conditions.countries.filter(c => c !== country)
        }
      }));
    };

    const toggleDay = (day: string) => {
      const newDays = new Set(selectedDays);
      if (newDays.has(day)) {
        newDays.delete(day);
      } else {
        newDays.add(day);
      }
      setSelectedDays(newDays);
    };

    const movePartner = (index: number, direction: 'up' | 'down') => {
      const newPriority = [...formData.partnerPriority];
      if (direction === 'up' && index > 0) {
        [newPriority[index], newPriority[index - 1]] = [newPriority[index - 1], newPriority[index]];
      } else if (direction === 'down' && index < newPriority.length - 1) {
        [newPriority[index], newPriority[index + 1]] = [newPriority[index + 1], newPriority[index]];
      }
      setFormData(prev => ({ ...prev, partnerPriority: newPriority }));
    };

    const addPartnerToPriority = (partnerId: string) => {
      if (!formData.partnerPriority.includes(partnerId)) {
        setFormData(prev => ({
          ...prev,
          partnerPriority: [...prev.partnerPriority, partnerId]
        }));
      }
    };

    const removePartnerFromPriority = (partnerId: string) => {
      setFormData(prev => ({
        ...prev,
        partnerPriority: prev.partnerPriority.filter(id => id !== partnerId)
      }));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {rule ? 'Edit Routing Rule' : 'Create New Routing Rule'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., US Prime Time Distribution"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        formData.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {formData.isActive ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                      <span>{formData.isActive ? 'Active' : 'Inactive'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Conditions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Routing Conditions</h3>
              
              {/* Countries */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Countries</label>
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
                  {formData.conditions.countries.map(country => (
                    <span
                      key={country}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      <Globe className="h-3 w-3 mr-1" />
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

              {/* Time Conditions */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time of Day (Optional)</label>
                  <input
                    type="text"
                    value={formData.conditions.timeOfDay}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      conditions: { ...prev.conditions, timeOfDay: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 09:00-17:00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Traffic Source (Optional)</label>
                  <select
                    value={formData.conditions.sourceId}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      conditions: { ...prev.conditions, sourceId: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Any Source</option>
                    {sources.map(source => (
                      <option key={source.id} value={source.id}>{source.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Days of Week */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Days of Week (Optional)</label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedDays.has(day)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Partner Priority */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Partner Priority Order</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Available Partners</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {partners
                      .filter(p => !formData.partnerPriority.includes(p.id))
                      .map(partner => (
                        <button
                          key={partner.id}
                          type="button"
                          onClick={() => addPartnerToPriority(partner.id)}
                          className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-left"
                        >
                          <span className="text-sm">{partner.name}</span>
                          <Plus className="h-4 w-4 text-gray-400" />
                        </button>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Priority Order</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {formData.partnerPriority.map((partnerId, index) => {
                      const partner = partners.find(p => p.id === partnerId);
                      if (!partner) return null;
                      
                      return (
                        <div key={partnerId} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                          <div className="flex items-center">
                            <span className="text-xs font-medium text-blue-600 mr-2">#{index + 1}</span>
                            <span className="text-sm">{partner.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() => movePartner(index, 'up')}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => movePartner(index, 'down')}
                              disabled={index === formData.partnerPriority.length - 1}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => removePartnerFromPriority(partnerId)}
                              className="p-1 text-red-400 hover:text-red-600"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Fallback Action */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fallback Action</h3>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="fallbackAction"
                    value="hold"
                    checked={formData.fallbackAction === 'hold'}
                    onChange={(e) => setFormData(prev => ({ ...prev, fallbackAction: e.target.value as 'hold' | 'distribute' }))}
                    className="mr-2"
                  />
                  <span className="text-sm">Hold for manual review</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="fallbackAction"
                    value="distribute"
                    checked={formData.fallbackAction === 'distribute'}
                    onChange={(e) => setFormData(prev => ({ ...prev, fallbackAction: e.target.value as 'hold' | 'distribute' }))}
                    className="mr-2"
                  />
                  <span className="text-sm">Continue to next available partner</span>
                </label>
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
                {rule ? 'Update Rule' : 'Create Rule'}
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
          <h1 className="text-3xl font-bold text-gray-900">Routing Rules</h1>
          <p className="text-gray-600 mt-1">Configure how leads are distributed to partners</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Rule
        </button>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {routingRules.map((rule) => (
          <div key={rule.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                  <div className="flex items-center space-x-2">
                    {rule.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <div className="w-2 h-2 bg-gray-500 rounded-full mr-1"></div>
                        Inactive
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Conditions */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Conditions</h4>
                    <div className="space-y-2">
                      {rule.conditions.countries.length > 0 && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Globe className="h-4 w-4 mr-2" />
                          <span>{rule.conditions.countries.join(', ')}</span>
                        </div>
                      )}
                      {rule.conditions.timeOfDay && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{rule.conditions.timeOfDay}</span>
                        </div>
                      )}
                      {rule.conditions.dayOfWeek && rule.conditions.dayOfWeek.length > 0 && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{rule.conditions.dayOfWeek.map(d => d.slice(0, 3)).join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Partner Priority */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Partner Priority</h4>
                    <div className="space-y-1">
                      {rule.partnerPriority.slice(0, 3).map((partnerId, index) => {
                        const partner = partners.find(p => p.id === partnerId);
                        return partner ? (
                          <div key={partnerId} className="flex items-center text-sm text-gray-600">
                            <span className="text-xs font-medium text-blue-600 mr-2">#{index + 1}</span>
                            <span>{partner.name}</span>
                          </div>
                        ) : null;
                      })}
                      {rule.partnerPriority.length > 3 && (
                        <div className="text-xs text-gray-500">+{rule.partnerPriority.length - 3} more</div>
                      )}
                    </div>
                  </div>

                  {/* Fallback */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Fallback Action</h4>
                    <div className="text-sm text-gray-600 capitalize">
                      {rule.fallbackAction === 'hold' ? 'Hold for manual review' : 'Continue distribution'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateRoutingRule(rule.id, { isActive: !rule.isActive })}
                  className={`p-2 rounded-lg transition-colors ${
                    rule.isActive 
                      ? 'text-green-600 hover:bg-green-50' 
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {rule.isActive ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => setEditingRule(rule)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {routingRules.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No routing rules yet</h3>
            <p className="text-gray-600 mb-6">Create your first routing rule to start distributing leads automatically</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Rule
            </button>
          </div>
        )}
      </div>

      {/* Add Rule Modal */}
      {showAddModal && (
        <RuleModal
          onClose={() => setShowAddModal(false)}
          onSave={(ruleData) => addRoutingRule(ruleData)}
        />
      )}

      {/* Edit Rule Modal */}
      {editingRule && (
        <RuleModal
          rule={editingRule}
          onClose={() => setEditingRule(null)}
          onSave={(ruleData) => {
            updateRoutingRule(editingRule.id, ruleData);
            setEditingRule(null);
          }}
        />
      )}
    </div>
  );
};

export default RoutingRules;