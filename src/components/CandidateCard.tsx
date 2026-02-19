interface Props {
  name: string;
  skill: string;
}

export default function CandidateCard({ name, skill }: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-gray-600">{skill}</p>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        View Profile
      </button>
    </div>
  );
}
