export default function Hero() {
  return (
    <section className="bg-white rounded-xl shadow-lg p-10 flex justify-between items-center">
      <div className="max-w-lg">
        <h1 className="text-4xl font-bold text-gray-800">
          Verified Skills. <span className="text-blue-600">Trusted Talent.</span>
        </h1>
        <p className="mt-4 text-gray-600">
          Build your verified portfolio and get noticed by top employers.
        </p>
        <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg">
          Get Started
        </button>
      </div>

      <img
        src="/hero.jpg"
        className="w-96 rounded-xl"
      />
    </section>
  );
}
