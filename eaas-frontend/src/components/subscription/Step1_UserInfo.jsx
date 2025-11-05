import { useState, useEffect } from 'react';
import { subscriptionService } from '../../services/subscriptionService.js';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

const Step1_UserInfo = ({ formData, setFormData, onNext }) => {
  const [address, setAddress] = useState(formData.address || '');
  const [monthlyBill, setMonthlyBill] = useState(formData.monthlyBill || '');
  const [recommendedPlan, setRecommendedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (monthlyBill && parseFloat(monthlyBill) > 0) {
      loadRecommendation();
    }
  }, [monthlyBill]);

  const loadRecommendation = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.recommendPlan(parseFloat(monthlyBill));
      setRecommendedPlan(data);
    } catch (error) {
      console.error('Error loading recommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!address || !monthlyBill) {
      alert('Please fill in all fields');
      return;
    }
    setFormData({ 
      ...formData, 
      address, 
      monthlyBill,
      recommendedPlanId: recommendedPlan?.recommended || null
    });
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Tell us about yourself</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input"
            rows={3}
            placeholder="Enter your complete address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Average Monthly Electricity Bill (₹)
          </label>
          <input
            type="number"
            value={monthlyBill}
            onChange={(e) => setMonthlyBill(e.target.value)}
            className="input"
            placeholder="e.g., 3000"
            min="0"
          />
          <p className="text-sm text-gray-500 mt-1">
            This helps us recommend the best plan for you
          </p>
        </div>

        {loading && (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        )}

        {recommendedPlan && !loading && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <h3 className="font-semibold text-primary-900 mb-2">
              Recommended Plan for You
            </h3>
            <p className="text-sm text-primary-700">
              Based on your monthly bill of ₹{monthlyBill}, we recommend the{' '}
              <strong>{recommendedPlan.recommended?.plan_name || 'Basic Solar'}</strong> plan.
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button onClick={handleNext} className="btn btn-primary">
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step1_UserInfo;

