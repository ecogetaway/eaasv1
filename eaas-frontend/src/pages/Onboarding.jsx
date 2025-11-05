import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Navbar from '../components/common/Navbar.jsx';
import StepIndicator from '../components/subscription/StepIndicator.jsx';
import Step1_UserInfo from '../components/subscription/Step1_UserInfo.jsx';
import Step2_PlanSelection from '../components/subscription/Step2_PlanSelection.jsx';
import Step3_Payment from '../components/subscription/Step3_Payment.jsx';

const Onboarding = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    address: '',
    monthlyBill: '',
    selectedPlan: null,
    recommendedPlanId: null,
  });

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <StepIndicator currentStep={currentStep} totalSteps={3} />
          
          {currentStep === 1 && (
            <Step1_UserInfo
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
            />
          )}
          
          {currentStep === 2 && (
            <Step2_PlanSelection
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          
          {currentStep === 3 && (
            <Step3_Payment
              formData={formData}
              onBack={handleBack}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Onboarding;

