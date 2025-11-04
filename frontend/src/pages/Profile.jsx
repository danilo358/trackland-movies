import React from 'react';
import ProfileEdit from '../components/user/ProfileEdit.jsx';
import AccountDelete from '../components/user/AccountDelete.jsx';

export default function Profile() {
  return (
    <div className="space-y-6">
      <ProfileEdit />
      <AccountDelete />
    </div>
  );
}
