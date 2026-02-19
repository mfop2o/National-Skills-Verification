import DashboardStats from "@/src/components/DashboardStats";
import SkillCard from "@/src/components/SkillCard";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Welcome, John!</h2>

      <DashboardStats />

      <div>
        <h3 className="text-xl font-semibold mb-4">My Verified Skills</h3>
        <div className="grid grid-cols-3 gap-4">
          <SkillCard name="Python Programming" verified />
          <SkillCard name="Project Management" />
        </div>
      </div>
    </div>
  );
}
