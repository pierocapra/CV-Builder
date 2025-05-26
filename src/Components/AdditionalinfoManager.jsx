import React, { useState, useEffect } from 'react';
import { useAuth } from '../Utils/AuthContext';
import { useCv } from '../Utils/cvHooks';
import Spinner from './Spinner';

export default function AdditionalInfoManager({ onClose }) {
  const { user, saveData } = useAuth();
  const { additionalInfo, setAdditionalInfo } = useCv();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    dateOfBirth: '',
    eligibleToWorkInUk: false,
    hasDrivingLicense: false,
    summaries: [''],
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (additionalInfo && Object.keys(additionalInfo).length > 0) {
      setFormData({
        ...additionalInfo,
        summaries: additionalInfo.summaries || (additionalInfo.summary ? [additionalInfo.summary] : [''])
      });
    }
  }, [additionalInfo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSummaryChange = (idx, value) => {
    setFormData((prev) => {
      const newSummaries = [...prev.summaries];
      newSummaries[idx] = value;
      return { ...prev, summaries: newSummaries };
    });
  };

  const handleAddSummary = () => {
    setFormData((prev) => ({ ...prev, summaries: [...prev.summaries, ''] }));
  };

  const handleRemoveSummary = (idx) => {
    setFormData((prev) => {
      const newSummaries = prev.summaries.filter((_, i) => i !== idx);
      return { ...prev, summaries: newSummaries.length ? newSummaries : [''] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const dataToSave = { ...formData };
      delete dataToSave.summary;
      if (user?.uid) {
        await saveData('additionalInfo', dataToSave);
      } else {
        localStorage.setItem('additionalInfo', JSON.stringify(dataToSave));
      }
      setAdditionalInfo(dataToSave);
      onClose();
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Additional Information</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            disabled={isSaving}
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="eligibleToWorkInUk"
              checked={formData.eligibleToWorkInUk}
              onChange={handleChange}
              className="w-4 h-4"
              disabled={isSaving}
            />
            <span>Eligible to work in the UK</span>
          </label>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="hasDrivingLicense"
              checked={formData.hasDrivingLicense}
              onChange={handleChange}
              className="w-4 h-4"
              disabled={isSaving}
            />
            <span>Has Driving License</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Professional Summaries
          </label>
          {formData.summaries.map((summary, idx) => (
            <div key={idx} className="flex items-center mb-2 gap-2">
              <textarea
                name={`summary-${idx}`}
                value={summary}
                onChange={e => handleSummaryChange(idx, e.target.value)}
                placeholder="e.g. A highly motivated software developer with experience in React and Node.js..."
                className="border p-2 rounded w-full h-24"
                disabled={isSaving}
              />
              {formData.summaries.length > 1 && (
                <button type="button" onClick={() => handleRemoveSummary(idx)} className="text-red-500 px-2 py-1 rounded hover:bg-red-100">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddSummary} className="text-blue-600 mt-2 px-2 py-1 rounded hover:bg-blue-100">+ Add Another Summary</button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center justify-center gap-2"
          disabled={isSaving}
        >
          {isSaving ? <Spinner size="sm" color="white" /> : null}
          Save
        </button>
      </form>
    </div>
  );
}