import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Loader2, CheckCircle, Upload } from 'lucide-react';
import { createCase } from '../api/serviceNow';

const CreateCase = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    short_description: '',
    description: '',
    priority: '3',
    category: 'inquiry',
    contact_type: 'self-service' // Extra field to trigger business rules
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await createCase(formData);
      setSuccessMsg(`Case created successfully! Reference: ${result.number}`);
      
      // Auto dismiss success and navigate
      setTimeout(() => {
        navigate(`/track-case?number=${result.number}`);
      }, 2500);
      
    } catch (err) {
      console.error(err);
      setError('Failed to create case. Please verify your connection or table setup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Create New Case</h1>
        <p className="text-gray-500 mt-2 text-lg">Submit a new request to the AI-powered support desk.</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 flex items-center space-x-3 rounded-r-xl shadow-sm">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <span className="text-green-800 font-medium">{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-xl shadow-sm font-medium">
          {error}
        </div>
      )}

      <div className="glass-panel p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Issue Summary</label>
            <input
              type="text"
              name="short_description"
              required
              value={formData.short_description}
              onChange={handleChange}
              className="input-field"
              placeholder="Brief summary of the issue (e.g. My Mobile is not working)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
              >
                <option value="inquiry">General Inquiry</option>
                <option value="software">Software Issue</option>
                <option value="hardware">Hardware Issue</option>
                <option value="network">Network/Connectivity</option>
                <option value="billing">Billing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
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
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Description</label>
            <textarea
              name="description"
              rows={5}
              required
              value={formData.description}
              onChange={handleChange}
              className="input-field resize-none"
              placeholder="Provide all necessary details..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Attachments</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer">
               <Upload className="h-8 w-8 text-gray-400 mb-2" />
               <p className="text-sm text-gray-500 font-medium">Click to upload or drag and drop</p>
               <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or PDF (max. 10MB)</p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading || successMsg !== ''}
              className="btn-primary"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Submit Case</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCase;
