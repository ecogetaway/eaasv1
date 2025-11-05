import { useState, useEffect } from 'react';
import { subscriptionService } from '../../services/subscriptionService.js';
import { Check, Zap, Battery, Star } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters.js';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import { cn } from '../../utils/cn.js';

const Step2_PlanSelection = ({ formData, setFormData, onNext, onBack }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(formData.selectedPlan || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getPlans();
      setPlans(data);
      
      // Auto-select recommended plan if available
      if (formData.recommendedPlanId) {
        const recommended = data.find(p => p.plan_id === formData.recommendedPlanId);
        if (recommended) {
          setSelectedPlan(recommended.plan_id);
        }
      }
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!selectedPlan) {
      alert('Please select a plan');
      return;
    }
    setFormData({ ...formData, selectedPlan });
    onNext();
  };

  const getPlanIcon = (planType) => {
    if (planType === 'premium') return Star;
    if (planType === 'solar_battery') return Battery;
    return Zap;
  };

  const parseFeatures = (features) => {
    try {
      return typeof features === 'string' ? JSON.parse(features) : features;
    } catch {
      return Array.isArray(features) ? features : [];
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Choose Your Plan</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => {
          const Icon = getPlanIcon(plan.plan_type);
          const features = parseFeatures(plan.features);
          const isSelected = selectedPlan === plan.plan_id;
          const isRecommended = plan.plan_id === formData.recommendedPlanId;

          return (
            <div
              key={plan.plan_id}
              onClick={() => setSelectedPlan(plan.plan_id)}
              className={cn(
                'card cursor-pointer transition-all hover:shadow-lg',
                isSelected && 'ring-2 ring-primary-600 border-primary-600',
                isRecommended && 'border-2 border-yellow-400'
              )}
            >
              {isRecommended && (
                <div className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full inline-block mb-4">
                  Recommended
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8 text-primary-600" />
                {isSelected && (
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold mb-2">{plan.plan_name}</h3>
              
              <div className="mb-4">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  {formatCurrency(plan.monthly_fee)}
                </div>
                <div className="text-sm text-gray-600">per month</div>
                <div className="text-sm text-gray-500 mt-1">
                  Setup: {formatCurrency(plan.setup_fee)}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <Zap className="w-4 h-4 text-yellow-500 mr-2" />
                  <span>{plan.solar_capacity} kW Solar</span>
                </div>
                {plan.battery_capacity > 0 && (
                  <div className="flex items-center text-sm">
                    <Battery className="w-4 h-4 text-green-500 mr-2" />
                    <span>{plan.battery_capacity} kWh Battery</span>
                  </div>
                )}
                {plan.estimated_savings && (
                  <div className="text-sm text-green-600 font-semibold">
                    Save ~{formatCurrency(plan.estimated_savings)}/month
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="text-sm font-semibold mb-2">Features:</div>
                <ul className="space-y-1">
                  {features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="btn btn-secondary">
          Back
        </button>
        <button onClick={handleNext} className="btn btn-primary">
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default Step2_PlanSelection;

