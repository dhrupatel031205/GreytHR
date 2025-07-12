import React, { useState } from 'react';
import { CheckCircle, Circle, ArrowRight, ArrowLeft } from 'lucide-react';
import PersonalDetails from './PersonalDetails';
import FamilyInfo from './FamilyInfo';
import EducationInfo from './EducationInfo';
import WorkExperience from './WorkExperience';
import BankInfo from './BankInfo';
import DocumentUpload from './DocumentUpload';
import Declaration from './Declaration';

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    { id: 0, title: 'Personal Details', component: PersonalDetails },
    { id: 1, title: 'Family Information', component: FamilyInfo },
    { id: 2, title: 'Education', component: EducationInfo },
    { id: 3, title: 'Work Experience', component: WorkExperience },
    { id: 4, title: 'Bank Information', component: BankInfo },
    { id: 5, title: 'Document Upload', component: DocumentUpload },
    { id: 6, title: 'Declaration & Review', component: Declaration },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= Math.max(...completedSteps, -1) + 1) {
      setCurrentStep(stepIndex);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Onboarding</h1>
          <p className="text-gray-600">Complete your profile to get started</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <button
                  onClick={() => handleStepClick(index)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors duration-200 ${
                    completedSteps.includes(index)
                      ? 'bg-green-500 text-white cursor-pointer'
                      : index === currentStep
                      ? 'bg-blue-500 text-white cursor-pointer'
                      : index <= Math.max(...completedSteps, -1) + 1
                      ? 'bg-gray-300 text-gray-600 cursor-pointer hover:bg-gray-400'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={index > Math.max(...completedSteps, -1) + 1}
                >
                  {completedSteps.includes(index) ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </button>
                <span className={`text-xs text-center ${
                  index === currentStep ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-full h-0.5 mt-5 ${
                    completedSteps.includes(index) ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>

          <CurrentStepComponent />
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;