import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'; // ✅ fixed


const schema = yup.object({
  bankName: yup.string().required('Bank name is required'),
  accountHolderName: yup.string().required('Account holder name is required'),
  accountNumber: yup.string().required('Account number is required'),
  confirmAccountNumber: yup.string()
    .required('Please confirm account number')
    .oneOf([yup.ref('accountNumber')], 'Account numbers must match'),
  routingNumber: yup.string().required('Routing number is required'),
  accountType: yup.string().required('Account type is required'),
  branchName: yup.string(),
  branchAddress: yup.string(),
  swiftCode: yup.string(),
});

type BankInfoFormData = yup.InferType<typeof schema>;

const BankInfo: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BankInfoFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: BankInfoFormData) => {
    console.log('Bank Info:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Important Information</h4>
        <p className="text-sm text-blue-800">
          This information will be used for salary payments and other financial transactions. 
          Please ensure all details are accurate and match your bank records.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bank Name *
          </label>
          <input
            {...register('bankName')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.bankName && (
            <p className="mt-1 text-sm text-red-600">{errors.bankName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Holder Name *
          </label>
          <input
            {...register('accountHolderName')}
            type="text"
            placeholder="As per bank records"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.accountHolderName && (
            <p className="mt-1 text-sm text-red-600">{errors.accountHolderName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Number *
          </label>
          <input
            {...register('accountNumber')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.accountNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.accountNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Account Number *
          </label>
          <input
            {...register('confirmAccountNumber')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.confirmAccountNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmAccountNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Routing Number *
          </label>
          <input
            {...register('routingNumber')}
            type="text"
            placeholder="9-digit routing number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.routingNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.routingNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Type *
          </label>
          <select
            {...register('accountType')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Account Type</option>
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
            <option value="business">Business</option>
          </select>
          {errors.accountType && (
            <p className="mt-1 text-sm text-red-600">{errors.accountType.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Branch Name
          </label>
          <input
            {...register('branchName')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SWIFT Code (for international transfers)
          </label>
          <input
            {...register('swiftCode')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Branch Address
        </label>
        <textarea
          {...register('branchAddress')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">Security Notice</h4>
        <p className="text-sm text-yellow-800">
          Your banking information is encrypted and stored securely. This information will only be 
          used for payroll purposes and will not be shared with unauthorized parties.
        </p>
      </div>
    </form>
  );
};

export default BankInfo;