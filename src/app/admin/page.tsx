import React from 'react';
export default function AdminDashboard() {
  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-1 bg-white p-4 shadow rounded">
        <p>Sidebar</p>
      </div>

      <div className="col-span-3 bg-white p-6 shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Pending Institutions</h2>
        <p>Institution requests here...</p>
      </div>
    </div>
  );
}
