import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Plus, Trash2 } from 'lucide-react';

const familyMemberSchema = yup.object({
  name: yup.string().required('Name is required'),
  relationship: yup.string().required('Relationship is required'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  occupation: yup.string(),
  phone: yup.string(),
});

const schema = yup.object({
  emergencyContactName: yup.string().required('Emergency contact name is required'),
  emergencyContactRelationship: yup.string().required('Relationship is required'),
  emergencyContactPhone: yup.string().required('Emergency contact phone is required'),
  emergencyContactAddress: yup.string().required('Emergency contact address is required'),
  familyMembers: yup.array().of(familyMemberSchema),
});

type FamilyInfoFormData = yup.InferType<typeof schema>;

const FamilyInfo: React.FC = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FamilyInfoFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      familyMembers: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'familyMembers',
  });

  const onSubmit = (data: FamilyInfoFormData) => {
    console.log('Family Info:', data);
  };

  const addFamilyMember = () => {
    append({
      name: '',
      relationship: '',
      dateOfBirth: '',
      occupation: '',
      phone: '',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Emergency Contact */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Name *
            </label>
            <input
              {...register('emergencyContactName')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.emergencyContactName && (
              <p className="mt-1 text-sm text-red-600">{errors.emergencyContactName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relationship *
            </label>
            <select
              {...register('emergencyContactRelationship')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Relationship</option>
              <option value="spouse">Spouse</option>
              <option value="parent">Parent</option>
              <option value="sibling">Sibling</option>
              <option value="child">Child</option>
              <option value="friend">Friend</option>
              <option value="other">Other</option>
            </select>
            {errors.emergencyContactRelationship && (
              <p className="mt-1 text-sm text-red-600">{errors.emergencyContactRelationship.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              {...register('emergencyContactPhone')}
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.emergencyContactPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.emergencyContactPhone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <textarea
              {...register('emergencyContactAddress')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.emergencyContactAddress && (
              <p className="mt-1 text-sm text-red-600">{errors.emergencyContactAddress.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Family Members */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Family Members</h3>
          <button
            type="button"
            onClick={addFamilyMember}
            className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Family Member
          </button>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No family members added yet</p>
            <button
              type="button"
              onClick={addFamilyMember}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Add your first family member
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900">
                    Family Member {index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      {...register(`familyMembers.${index}.name`)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.familyMembers?.[index]?.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.familyMembers[index]?.name?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Relationship *
                    </label>
                    <select
                      {...register(`familyMembers.${index}.relationship`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Relationship</option>
                      <option value="spouse">Spouse</option>
                      <option value="child">Child</option>
                      <option value="parent">Parent</option>
                      <option value="sibling">Sibling</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.familyMembers?.[index]?.relationship && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.familyMembers[index]?.relationship?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth *
                    </label>
                    <input
                      {...register(`familyMembers.${index}.dateOfBirth`)}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.familyMembers?.[index]?.dateOfBirth && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.familyMembers[index]?.dateOfBirth?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Occupation
                    </label>
                    <input
                      {...register(`familyMembers.${index}.occupation`)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      {...register(`familyMembers.${index}.phone`)}
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
};

export default FamilyInfo;