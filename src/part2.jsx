import { useState } from "react";

const MicroprogramControl = () => {
  const [implementationType, setImplementationType] = useState("vertical");
  const [numRegisters, setNumRegisters] = useState("");
  const [numALUFunctions, setNumALUFunctions] = useState("");
  const [instruction, setInstruction] = useState("");
  const [numBuses, setNumBuses] = useState("3");
  const [results, setResults] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Example processing logic
    const sequenceOfMicrooperations = [
      `Fetch instruction ${instruction}`,
      "Decode instruction",
      `Execute ${instruction} using ${numALUFunctions} ALU functions`,
    ];
    const controlWord = implementationType === "vertical"
      ? "11010101" // Example control word for vertical
      : "10101010"; // Example control word for horizontal

    setResults({
      sequenceOfMicrooperations,
      controlWord,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white shadow-md rounded p-6">
        <h1 className="text-xl font-bold mb-4 text-center">Microprogrammed Control</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Implementation Type */}
          <div>
            <label className="block font-medium mb-2">Implementation Type:</label>
            <select
              value={implementationType}
              onChange={(e) => setImplementationType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
            </select>
          </div>

          {/* Number of Registers */}
          <div>
            <label className="block font-medium mb-2">Number of Registers:</label>
            <input
              type="number"
              value={numRegisters}
              onChange={(e) => setNumRegisters(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Number of ALU Functions */}
          <div>
            <label className="block font-medium mb-2">Number of ALU Functions:</label>
            <input
              type="number"
              value={numALUFunctions}
              onChange={(e) => setNumALUFunctions(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Instruction to Execute */}
          <div>
            <label className="block font-medium mb-2">Instruction to Execute:</label>
            <input
              type="text"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Number of Buses */}
          <div>
            <label className="block font-medium mb-2">Number of Buses:</label>
            <select
              value={numBuses}
              onChange={(e) => setNumBuses(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="3">3-bus</option>
              <option value="2">2-bus</option>
              <option value="1">1-bus</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Generate Microprogram
          </button>
        </form>

        {/* Results */}
        {results && (
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">Results:</h2>
            <div>
              <p className="font-medium">Sequence of Microoperations:</p>
              <ul className="list-disc list-inside">
                {results.sequenceOfMicrooperations.map((op, index) => (
                  <li key={index}>{op}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <p className="font-medium">Final Control Word:</p>
              <p className="bg-gray-200 p-2 rounded">{results.controlWord}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MicroprogramControl;
