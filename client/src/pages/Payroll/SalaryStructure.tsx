import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';

interface SalaryComponent {
  id: string;
  name: string;
  type: 'earning' | 'deduction';
  calculationType: 'fixed' | 'percentage';
  value: number;
  baseComponent?: string;
  taxable: boolean;
  mandatory: boolean;
}

const schema = yup.object({
  name: yup.string().required('Component name is required'),
  type: yup.string().oneOf(['earning', 'deduction']).required('Type is required'),
  calculationType: yup.string().oneOf(['fixed', 'percentage']).required('Calculation type is required'),
  value: yup.number().positive('Value must be positive').required('Value is required'),
  baseComponent: yup.string().when('calculationType', {
    is: 'percentage',
    then: (schema) => schema.required('Base component is required for percentage calculation'),
    otherwise: (schema) => schema.notRequired(),
  }),
  taxable: yup.boolean(),
  mandatory: yup.boolean(),
});

type ComponentFormData = yup.InferType<typeof schema>;

const SalaryStructure: React.FC = () => {
  const [components, setComponents] = useState<SalaryComponent[]>([
    {
      id: '1',
      name: 'Basic Salary',
      type: 'earning',
      calculationType: 'fixed',
      value: 3000,
      taxable: true,
      mandatory: true,
    },
    {
      id: '2',
      name: 'HRA',
      type: 'earning',
      calculationType: 'percentage',
      value: 50,
      baseComponent: 'Basic Salary',
      taxable: true,
      mandatory: true,
    },
    {
      id: '3',
      name: 'Transport Allowance',
      type: 'earning',
      calculationType: 'fixed',
      value: 200,
      taxable: false,
      mandatory: false,
    },
    {
      id: '4',
      name: 'PF',
      type: 'deduction',
      calculationType: 'percentage',
      value: 12,
      baseComponent: 'Basic Salary',
      taxable: false,
      mandatory: true,
    },
    {
      id: '5',
      name: 'ESI',
      type: 'deduction',
      calculationType: 'percentage',
      value: 1.75,
      baseComponent: 'Basic Salary',
      taxable: false,
      mandatory: true,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingComponent, setEditingComponent] = useState<SalaryComponent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ComponentFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      taxable: false,
      mandatory: false,
    },
  });

  const calculationType = watch('calculationType');
  const componentType = watch('type');

  const filteredComponents = components.filter(component =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const earningComponents = filteredComponents.filter(c => c.type === 'earning');
  const deductionComponents = filteredComponents.filter(c => c.type === 'deduction');

  const handleFormSubmit = (data: ComponentFormData) => {
    if (editingComponent) {
      setComponents(components.map(c => 
        c.id === editingComponent.id 
          ? { ...data, id: editingComponent.id } as SalaryComponent
          : c
      ));
      toast.success('Salary component updated successfully!');
    } else {
      const newComponent: SalaryComponent = {
        ...data,
        id: Date.now().toString(),
      } as SalaryComponent;
      setComponents([...components, newComponent]);
      toast.success('Salary component added successfully!');
    }
    
    setShowForm(false);
    setEditingComponent(null);
    reset();
  };

  const handleEdit = (component: SalaryComponent) => {
    setEditingComponent(component);
    reset(component);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      setComponents(components.filter(c => c.id !== id));
      toast.success('Salary component deleted successfully!');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingComponent(null);
    reset();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Salary Structure Configuration</h3>
          <p className="text-gray-600">Define earnings and deduction components</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Component</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Components Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
            <h4 className="font-semibold text-green-800">Earnings ({earningComponents.length})</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Component</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {earningComponents.map((component) => (
                  <tr key={component.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{component.name}</div>
                        <div className="text-xs text-gray-500">
                          {component.taxable && <span className="bg-blue-100 text-blue-800 px-1 rounded mr-1">Taxable</span>}
                          {component.mandatory && <span className="bg-yellow-100 text-yellow-800 px-1 rounded">Mandatory</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {component.calculationType === 'fixed' 
                        ? `$${component.value}` 
                        : `${component.value}% of ${component.baseComponent}`
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(component)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {!component.mandatory && (
                          <button
                            onClick={() => handleDelete(component.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Deductions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
            <h4 className="font-semibold text-red-800">Deductions ({deductionComponents.length})</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Component</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {deductionComponents.map((component) => (
                  <tr key={component.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{component.name}</div>
                        <div className="text-xs text-gray-500">
                          {component.mandatory && <span className="bg-yellow-100 text-yellow-800 px-1 rounded">Mandatory</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {component.calculationType === 'fixed' 
                        ? `$${component.value}` 
                        : `${component.value}% of ${component.baseComponent}`
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(component)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {!component.mandatory && (
                          <button
                            onClick={() => handleDelete(component.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleFormClose} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingComponent ? 'Edit Component' : 'Add Component'}
                </h2>
                <button
                  onClick={handleFormClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Component Name *
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type *
                    </label>
                    <select
                      {...register('type')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select type</option>
                      <option value="earning">Earning</option>
                      <option value="deduction">Deduction</option>
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Calculation Type *
                    </label>
                    <select
                      {...register('calculationType')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select calculation type</option>
                      <option value="fixed">Fixed Amount</option>
                      <option value="percentage">Percentage</option>
                    </select>
                    {errors.calculationType && (
                      <p className="mt-1 text-sm text-red-600">{errors.calculationType.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Value *
                    </label>
                    <input
                      {...register('value')}
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={calculationType === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                    />
                    {errors.value && (
                      <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
                    )}
                  </div>

                  {calculationType === 'percentage' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Base Component *
                      </label>
                      <select
                        {...register('baseComponent')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select base component</option>
                        {components
                          .filter(c => c.type === 'earning')
                          .map(component => (
                            <option key={component.id} value={component.name}>
                              {component.name}
                            </option>
                          ))}
                      </select>
                      {errors.baseComponent && (
                        <p className="mt-1 text-sm text-red-600">{errors.baseComponent.message}</p>
                      )}
                    </div>
                  )}

                  {componentType === 'earning' && (
                    <div className="flex items-center">
                      <input
                        {...register('taxable')}
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        Taxable
                      </label>
                    </div>
                  )}

                  <div className="flex items-center">
                    <input
                      {...register('mandatory')}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Mandatory (cannot be deleted)
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleFormClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    {editingComponent ? 'Update Component' : 'Add Component'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryStructure;