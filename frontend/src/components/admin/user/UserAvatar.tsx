import React from 'react';

interface UserAvatarProps {
  avatarUrl?: string;
  fullName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  avatarUrl,
  fullName,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
  };

  const getInitials = (name: string): string => {
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  const [imageError, setImageError] = React.useState(false);

  if (avatarUrl && !imageError) {
    return (
      <img
        src={avatarUrl}
        alt={fullName}
        onError={() => setImageError(true)}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-white ${className}`}
      title={fullName}
    >
      {getInitials(fullName)}
    </div>
  );
};

export default UserAvatar;
