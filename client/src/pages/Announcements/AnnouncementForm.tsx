import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Announcement } from './Announcements';
import { useAuth } from '../../contexts/AuthContext';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  message: yup.string().required('Message is required').min(10, 'Message must be at least 10 characters'),
  audience: yup.string().oneOf(['all', 'department', 'role']).required('Audience is required'),
  targetDepartment: yup.string().when('audience', {
    is: 'department',
    then: (schema) => schema.required('Department is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  targetRole: yup.string().when('audience', {
    is: 'role',
    then: (schema) => schema.required('Role is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  priority: yup.string().oneOf(['normal', 'important', 'urgent']).required('Priority is required'),
  expiresAt: yup.string().nullable(),
});

type AnnouncementFormData = yup.InferType<typeof schema>;

interface AnnouncementFormProps {
  announcement?: Announcement | null;
  onClose: () => void;
  onSave: (announcement: Announcement) => void;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ announcement, onClose, onSave }) => {
  const { state } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AnnouncementFormData>({
    resolver: yupResolver(schema),
    defaultValues: announcement ? {
      title: announcement.title,
      message: announcement.message,
      audience: announcement.audience,
      targetDepartment: announcement.targetDepartment || '',
      targetRole: announcement.targetRole || '',
      priority: announcement.priority,
      expiresAt: announcement.expiresAt ? announcement.expiresAt.split('T')[0] : '',
    } : {
      audience: 'all',
      priority: 'normal',
    },
  });

  const audienceType = watch('audience');

  const onSubmit = (data: AnnouncementFormData) => {
    const newAnnouncement: Announcement = {
      id: announcement?.id || Date.now().toString(),
      title: data.title,
      message: data.message,
      author: state.user?.name || 'Unknown',
      audience: data.audience,
      targetDepartment: data.audience === 'department' ? data.targetDepartment : undefined,
      targetRole: data.audience === 'role' ? data.targetRole : undefined,
      priority: data.priority,
      createdAt: announcement?.createdAt || new Date().toISOString(),
      expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : undefined,
      isActive: true,
    };

    onSave(newAnnouncement);
    toast.success(announcement ? 'Announcement updated successfully!' : 'Announcement created successfully!');
  };

  const departments = ['Engineering', 'Human Resources', 'Marketing', 'Sales', 'Finance', 'Administration'];
  const roles = ['admin', 'hr', 'employee'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {announcement ? 'Edit Announcement' : 'Create Announcement'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  {...register('title')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter announcement title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  {...register('message')}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your announcement message..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Audience *
                  </label>
                  <select
                    {...register('audience')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Employees</option>
                    <option value="department">Specific Department</option>
                    <option value="role">Specific Role</option>
                  </select>
                  {errors.audience && (
                    <p className="mt-1 text-sm text-red-600">{errors.audience.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority *
                  </label>
                  <select
                    {...register('priority')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="important">Important</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  {errors.priority && (
                    <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
                  )}
                </div>
              </div>

              {audienceType === 'department' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Department *
                  </label>
                  <select
                    {...register('targetDepartment')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {errors.targetDepartment && (
                    <p className="mt-1 text-sm text-red-600">{errors.targetDepartment.message}</p>
                  )}
                </div>
              )}

              {audienceType === 'role' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Role *
                  </label>
                  <select
                    {...register('targetRole')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select role</option>
                    {roles.map(role => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.targetRole && (
                    <p className="mt-1 text-sm text-red-600">{errors.targetRole.message}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date (Optional)
                </label>
                <input
                  {...register('expiresAt')}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty for permanent announcement
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Preview</h4>
                <div className="text-sm text-blue-800">
                  <p><strong>Audience:</strong> {
                    audienceType === 'all' ? 'All Employees' :
                    audienceType === 'department' ? 'Department Specific' :
                    'Role Specific'
                  }</p>
                  <p><strong>Priority:</strong> {watch('priority')?.charAt(0).toUpperCase() + (watch('priority')?.slice(1) || '')}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {announcement ? 'Update Announcement' : 'Create Announcement'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementForm;