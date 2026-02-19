import CandidateCard from "@/src/components/CandidateCard";

export default function SearchPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Search Candidates</h2>

      <div className="space-y-4">
        <CandidateCard name="Alemu Bekele" skill="Web Developer" />
        <CandidateCard name="Liya Mengistu" skill="Data Analyst" />
      </div>
    </div>
  );
}
