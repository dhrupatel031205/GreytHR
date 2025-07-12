import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Plus, Trash2 } from 'lucide-react';

const educationSchema = yup.object({
  degree: yup.string().required('Degree is required'),
  institution: yup.string().required('Institution is required'),
  fieldOfStudy: yup.string().required('Field of study is required'),
  startYear: yup.string().required('Start year is required'),
  endYear: yup.string().required('End year is required'),
  grade: yup.string(),
  description: yup.string(),
});

const schema = yup.object({
  education: yup.array().of(educationSchema).min(1, 'At least one education entry is required'),
});

type EducationInfoFormData = yup.InferType<typeof schema>;

const EducationInfo: React.FC = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EducationInfoFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      education: [
        {
          degree: '',
          institution: '',
          fieldOfStudy: '',
          startYear: '',
          endYear: '',
          grade: '',
          description: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

  const onSubmit = (data: EducationInfoFormData) => {
    console.log('Education Info:', data);
  };

  const addEducation = () => {
    append({
      degree: '',
      institution: '',
      fieldOfStudy: '',
      startYear: '',
      endYear: '',
      grade: '',
      description: '',
    });
  };

  const degreeOptions = [
    'High School Diploma',
    'Associate Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'Doctoral Degree',
    'Professional Degree',
    'Certificate',
    'Diploma',
    'Other',
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Education History</h3>
        <button
          type="button"
          onClick={addEducation}
          className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </button>
      </div>

      {errors.education && (
        <p className="text-sm text-red-600">{errors.education.message}</p>
      )}

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900">
                Education {index + 1}
              </h4>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Degree/Qualification *
                </label>
                <select
                  {...register(`education.${index}.degree`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Degree</option>
                  {degreeOptions.map((degree) => (
                    <option key={degree} value={degree}>
                      {degree}
                    </option>
                  ))}
                </select>
                {errors.education?.[index]?.degree && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.education[index]?.degree?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institution/School *
                </label>
                <input
                  {...register(`education.${index}.institution`)}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.education?.[index]?.institution && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.education[index]?.institution?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field of Study *
                </label>
                <input
                  {...register(`education.${index}.fieldOfStudy`)}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.education?.[index]?.fieldOfStudy && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.education[index]?.fieldOfStudy?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade/GPA
                </label>
                <input
                  {...register(`education.${index}.grade`)}
                  type="text"
                  placeholder="e.g., 3.8 GPA, First Class, 85%"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Year *
                </label>
                <input
                  {...register(`education.${index}.startYear`)}
                  type="number"
                  min="1950"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.education?.[index]?.startYear && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.education[index]?.startYear?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Year *
                </label>
                <input
                  {...register(`education.${index}.endYear`)}
                  type="number"
                  min="1950"
                  max={new Date().getFullYear() + 10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.education?.[index]?.endYear && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.education[index]?.endYear?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                {...register(`education.${index}.description`)}
                rows={3}
                placeholder="Relevant coursework, achievements, projects, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};

export default EducationInfo;