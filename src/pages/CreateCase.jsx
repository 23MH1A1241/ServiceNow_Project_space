import React, { useState } from 'react';
import { FilePlus, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { createCase } from '../api/serviceNow';

const CreateCase = () => {
  const [formData, setFormData] = useState({
    short_description: '',
    description: '',
    priority: '3',
    urgency: '3'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(null);

    try {
      const result = await createCase(formData);
      setSuccess(result);
      setFormData({ short_description: '', description: '', priority: '3', urgency: '3' });
    } catch (err) {
      setError(err.message || 'An error occurred while creating the case.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Create New Case</h1>
        <p className="text-gray-500 mt-2 text-lg">Submit an issue to the automated CaseFlow AI routing engine.</p>
      </div>

      {success && (
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl flex flex-col items-center text-center animate-slide-up shadow-sm">
          <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
          <h3 className="text-xl font-bold text-green-800 mb-1">Case Created Successfully</h3>
          <p className="text-green-600 font-medium mb-4">Your case has been logged and assigned by the AI engine.</p>
          <div className="bg-white px-4 py-2 rounded-lg font-mono font-bold text-green-700 border border-green-100 shadow-sm">
            {success.number}
          </div>
        </div>
      )}

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center shadow-sm">
          <AlertCircle className="h-6 w-6 mr-3 flex-shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel p-8 md:p-10">
        <div className="space-y-8">
          <div>
            <label className="label-text">Short Description (Summary)</label>
            <input
              type="text"
              name="short_description"
              required
              value={formData.short_description}
              onChange={handleChange}
              className="input-field"
              placeholder="Briefly describe the issue..."
            />
          </div>

          <div>
            <label className="label-text">Detailed Description</label>
            <textarea
              name="description"
              required
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className="input-field resize-none"
              placeholder="Provide all necessary details, error codes, and steps to reproduce..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="label-text">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="input-field"
              >
                <option value="1">1 - Critical</option>
                <option value="2">2 - High</option>
                <option value="3">3 - Moderate</option>
                <option value="4">4 - Low</option>
              </select>
            </div>
            
            <div>
              <label className="label-text">Urgency</label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="input-field"
              >
                <option value="1">1 - High</option>
                <option value="2">2 - Medium</option>
                <option value="3">3 - Low</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Routing via AI...</span>
                </>
              ) : (
                <>
                  <FilePlus className="h-6 w-6 mr-2" />
                  <span>Submit Case</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCase;
