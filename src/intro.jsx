import { Link } from "react-router-dom";
export default function Intro() {
  return (
    <main className="flex flex-col justify-center items-center  gap-[400px] mt-2">
      <section className="  bg-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-32">
          Welcome to Simulation! What do you want to simulate?
        </h1>

        <div className="flex gap-20">
          <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition">
            <Link to="/part1">Cache Mapping Techniques</Link>
          </button>
          <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition">
            <Link to="/part2">Cache Mapping Techniques</Link>
          </button>
        </div>
      </section>
      <p className="ml-[1000px] text-2xl">submited to mrs. Habtam Atnaw</p>
    </main>
  );
}
