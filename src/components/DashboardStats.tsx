export default function DashboardStats() {
  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="bg-green-500 text-white p-4 rounded-lg">
        Profile Completion 75%
      </div>
      <div className="bg-blue-500 text-white p-4 rounded-lg">
        Verified Badges 5
      </div>
      <div className="bg-yellow-500 text-white p-4 rounded-lg">
        Pending Verification 2
      </div>
      <div className="bg-red-500 text-white p-4 rounded-lg">
        Portfolio Views 120
      </div>
    </div>
  );
}
