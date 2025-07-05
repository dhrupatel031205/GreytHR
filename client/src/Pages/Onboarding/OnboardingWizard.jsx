// src/Pages/Onboarding/OnboardingWizard.js

import React, { useState } from 'react';
import S1 from './S1Personal';
import S2 from './S2Address';
import S3 from './S3Family';
import S4 from './S4Job';
import S5 from './S5Education';
import S6 from './S6Dos';
import S7 from './S7Bank';
import S8 from './S8Declaration';

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const updateForm = (newData) => {
    setFormData({ ...formData, ...newData });
  };

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);

  const props = { formData, updateForm, next, back };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">📝 Employee Onboarding</h2>
      <div className="card shadow p-4 mb-5">
        {step === 1 && <S1 {...props} />}
        {step === 2 && <S2 {...props} />}
        {step === 3 && <S3 {...props} />}
        {step === 4 && <S4 {...props} />}
        {step === 5 && <S5 {...props} />}
        {step === 6 && <S6 {...props} />}
        {step === 7 && <S7 {...props} />}
        {step === 8 && <S8 {...props} />}
        <div className="d-flex justify-content-between mt-4">
          {step > 1 && <button onClick={back} className="btn btn-secondary">⬅ Back</button>}
          {step < 8 && <button onClick={next} className="btn btn-primary ms-auto">Next ➡</button>}
        </div>
      </div>
    </div>
  );
}
