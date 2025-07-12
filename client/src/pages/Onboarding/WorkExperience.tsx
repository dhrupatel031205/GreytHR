import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Plus, Trash2 } from 'lucide-react';

const experienceSchema = yup.object({
  company: yup.string().required('Company name is required'),
  position: yup.string().required('Position is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string().when('isCurrentJob', {
    is: false,
    then: (schema) => schema.required('End date is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  isCurrentJob: yup.boolean(),
  description: yup.string(),
  achievements: yup.string(),
  reasonForLeaving: yup.string(),
});

const schema = yup.object({
  experience: yup.array().of(experienceSchema),
  totalExperience: yup.string(),
  relevantSkills: yup.string(),
});

type WorkExperienceFormData = yup.InferType<typeof schema>;

const WorkExperience: React.FC = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<WorkExperienceFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      experience: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience',
  });

  const onSubmit = (data: WorkExperienceFormData) => {
    console.log('Work Experience:', data);
  };

  const addExperience = () => {
    append({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      isCurrentJob: false,
      description: '',
      achievements: '',
      reasonForLeaving: '',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
        <button
          type="button"
          onClick={addExperience}
          className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </button>
      </div>

      {/* Summary Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Years of Experience
          </label>
          <input
            {...register('totalExperience')}
            type="text"
            placeholder="e.g., 5 years"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Relevant Skills
          </label>
          <input
            {...register('relevantSkills')}
            type="text"
            placeholder="e.g., JavaScript, React, Node.js"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Experience Entries */}
      {fields.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-2">No work experience added yet</p>
          <p className="text-sm text-gray-400 mb-4">
            Add your previous work experience or select "Fresh Graduate" if this is your first job
          </p>
          <div className="space-x-4">
            <button
              type="button"
              onClick={addExperience}
              className="text-blue-600 hover:text-blue-800"
            >
              Add Work Experience
            </button>
            <span className="text-gray-400">or</span>
            <button
              type="button"
              className="text-green-600 hover:text-green-800"
            >
              I'm a Fresh Graduate
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {fields.map((field, index) => {
            const isCurrentJob = watch(`experience.${index}.isCurrentJob`);
            
            return (
              <div key={field.id} className="p-6 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900">
                    Experience {index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      {...register(`experience.${index}.company`)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.experience?.[index]?.company && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.experience[index]?.company?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position/Job Title *
                    </label>
                    <input
                      {...register(`experience.${index}.position`)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.experience?.[index]?.position && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.experience[index]?.position?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      {...register(`experience.${index}.startDate`)}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.experience?.[index]?.startDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.experience[index]?.startDate?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date {!isCurrentJob && '*'}
                    </label>
                    <input
                      {...register(`experience.${index}.endDate`)}
                      type="date"
                      disabled={isCurrentJob}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                    {errors.experience?.[index]?.endDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.experience[index]?.endDate?.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      {...register(`experience.${index}.isCurrentJob`)}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      This is my current job
                    </span>
                  </label>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description
                  </label>
                  <textarea
                    {...register(`experience.${index}.description`)}
                    rows={3}
                    placeholder="Describe your responsibilities and duties..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Achievements
                  </label>
                  <textarea
                    {...register(`experience.${index}.achievements`)}
                    rows={2}
                    placeholder="Notable accomplishments, awards, or recognitions..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {!isCurrentJob && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Leaving
                    </label>
                    <input
                      {...register(`experience.${index}.reasonForLeaving`)}
                      type="text"
                      placeholder="e.g., Career growth, Better opportunity"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </form>
  );
};

export default WorkExperience;