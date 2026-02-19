interface Props {
  name: string;
  verified?: boolean;
}

export default function SkillCard({ name, verified }: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
      <span>{name}</span>
      {verified && (
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
          Verified
        </span>
      )}
    </div>
  );
}
