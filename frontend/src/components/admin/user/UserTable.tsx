import React from 'react';
import type { UserResponse } from '../../../api/user';
import UserAvatar from './UserAvatar';
import UserStatusBadge from './UserStatusBadge';

interface UserTableProps {
  users: UserResponse[];
  onView: (userId: number) => void;
  onEdit: (userId: number) => void;
  onActivate: (userId: number) => void;
  onDeactivate: (userId: number) => void;
  onDelete: (userId: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  onView,
  onEdit,
  onActivate,
  onDeactivate,
  onDelete,
}) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Avatar
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Full Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Verified
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                {user.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <UserAvatar
                  avatarUrl={user.avatarUrl}
                  fullName={user.fullName}
                  size="md"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {user.fullName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {user.phoneNumber || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <UserStatusBadge isActive={user.isActive} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.emailVerifiedAt ? (
                  <span
                    className="inline-flex items-center text-green-600"
                    title={new Date(user.emailVerifiedAt).toLocaleString()}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                ) : (
                  <span className="text-gray-400">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </td>
              <td className="space-x-2 px-6 py-4 text-sm whitespace-nowrap">
                <button
                  onClick={() => onView(user.id)}
                  className="font-medium text-blue-600 hover:text-blue-800"
                >
                  View
                </button>
                <button
                  onClick={() => onEdit(user.id)}
                  className="font-medium text-green-600 hover:text-green-800"
                >
                  Edit
                </button>
                {user.isActive ? (
                  <button
                    onClick={() => onDeactivate(user.id)}
                    className="font-medium text-orange-600 hover:text-orange-800"
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => onActivate(user.id)}
                    className="font-medium text-green-600 hover:text-green-800"
                  >
                    Activate
                  </button>
                )}
                <button
                  onClick={() => onDelete(user.id)}
                  className="font-medium text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="mt-2">No users found</p>
        </div>
      )}
    </div>
  );
};

export default UserTable;
