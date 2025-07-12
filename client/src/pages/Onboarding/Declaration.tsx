import React, { useState } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const Declaration: React.FC = () => {
  const [agreements, setAgreements] = useState({
    accuracy: false,
    backgroundCheck: false,
    policies: false,
    confidentiality: false,
    terms: false,
  });

  const handleAgreementChange = (key: keyof typeof agreements) => {
    setAgreements(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const allAgreed = Object.values(agreements).every(Boolean);

  const handleSubmit = () => {
    if (allAgreed) {
      console.log('Onboarding completed!');
      // Handle final submission
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-green-900">Almost Done!</h3>
        </div>
        <p className="text-green-800">
          You've successfully completed all the required sections. Please review the information 
          below and provide your consent to finalize your onboarding process.
        </p>
      </div>

      {/* Review Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Information Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Personal Details:</span>
            <span className="text-green-600 ml-2">✓ Completed</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Family Information:</span>
            <span className="text-green-600 ml-2">✓ Completed</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Education:</span>
            <span className="text-green-600 ml-2">✓ Completed</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Work Experience:</span>
            <span className="text-green-600 ml-2">✓ Completed</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Bank Information:</span>
            <span className="text-green-600 ml-2">✓ Completed</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Documents:</span>
            <span className="text-green-600 ml-2">✓ Uploaded</span>
          </div>
        </div>
      </div>

      {/* Declarations and Agreements */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Declarations & Agreements</h4>
        <div className="space-y-4">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={agreements.accuracy}
              onChange={() => handleAgreementChange('accuracy')}
              className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <div className="text-sm">
              <span className="font-medium text-gray-900">Information Accuracy</span>
              <p className="text-gray-600 mt-1">
                I declare that all information provided in this application is true, complete, and accurate to the best of my knowledge. I understand that any false or misleading information may result in the rejection of my application or termination of employment.
              </p>
            </div>
          </label>

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={agreements.backgroundCheck}
              onChange={() => handleAgreementChange('backgroundCheck')}
              className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <div className="text-sm">
              <span className="font-medium text-gray-900">Background Check Consent</span>
              <p className="text-gray-600 mt-1">
                I authorize the company to conduct background checks, reference checks, and verification of the information provided. I understand this may include employment history, education verification, and criminal background checks as permitted by law.
              </p>
            </div>
          </label>

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={agreements.policies}
              onChange={() => handleAgreementChange('policies')}
              className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <div className="text-sm">
              <span className="font-medium text-gray-900">Company Policies</span>
              <p className="text-gray-600 mt-1">
                I acknowledge that I have received, read, and understood the company's employee handbook, code of conduct, and other relevant policies. I agree to comply with all company policies and procedures.
              </p>
            </div>
          </label>

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={agreements.confidentiality}
              onChange={() => handleAgreementChange('confidentiality')}
              className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <div className="text-sm">
              <span className="font-medium text-gray-900">Confidentiality Agreement</span>
              <p className="text-gray-600 mt-1">
                I agree to maintain the confidentiality of all proprietary and confidential information of the company and its clients. I will not disclose such information to unauthorized parties during or after my employment.
              </p>
            </div>
          </label>

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={agreements.terms}
              onChange={() => handleAgreementChange('terms')}
              className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <div className="text-sm">
              <span className="font-medium text-gray-900">Terms and Conditions</span>
              <p className="text-gray-600 mt-1">
                I have read and agree to the terms and conditions of employment, including but not limited to compensation, benefits, working hours, and termination policies as outlined in my employment contract.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Digital Signature */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Digital Signature</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-700 mb-3">
            By clicking "Complete Onboarding" below, I electronically sign this document and acknowledge that:
          </p>
          <ul className="text-sm text-gray-600 space-y-1 ml-4">
            <li>• This electronic signature has the same legal effect as a handwritten signature</li>
            <li>• I have read and understood all the information provided</li>
            <li>• I agree to all the declarations and agreements stated above</li>
            <li>• The information provided is accurate and complete</li>
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Date: {new Date().toLocaleDateString()} | 
              Time: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Warning if not all agreed */}
      {!allAgreed && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <p className="text-sm text-yellow-800">
              Please review and agree to all declarations and agreements above to complete your onboarding.
            </p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <button
          onClick={handleSubmit}
          disabled={!allAgreed}
          className={`px-8 py-3 rounded-lg font-medium text-white transition-colors duration-200 ${
            allAgreed
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {allAgreed ? 'Complete Onboarding' : 'Please Complete All Agreements'}
        </button>
      </div>

      {allAgreed && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            After submission, you will receive a confirmation email with next steps.
          </p>
        </div>
      )}
    </div>
  );
};

export default Declaration;