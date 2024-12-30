import React, { useState } from "react";

const CacheSimulator = () => {
  const [cacheType, setCacheType] = useState("direct");
  const [cacheSize] = useState(4);
  const [cache, setCache] = useState(Array(cacheSize).fill(null));
  const [mainMemory, setMainMemory] = useState(
    Array(16)
      .fill(null)
      .map((_, i) => `Word ${i + 1}`)
  );
  const [hitCount, setHitCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [replacementPolicy, setReplacementPolicy] = useState("fifo");

  const getRandomWord = () => {
    return mainMemory[Math.floor(Math.random() * mainMemory.length)];
  };

  const handleRequest = (word) => {
    const blockIndex = mainMemory.indexOf(word);
    if (cacheType === "direct") {
      handleDirectMapping(blockIndex, word);
    } else if (cacheType === "associative") {
      handleAssociativeMapping(word);
    } else if (cacheType === "setAssociative") {
      handleSetAssociativeMapping(blockIndex, word);
    }
  };

  const handleDirectMapping = (blockIndex, word) => {
    const cacheLineIndex = blockIndex % cacheSize;

    if (cache[cacheLineIndex] === word) {
      setHitCount(hitCount + 1);
    } else {
      setMissCount(missCount + 1);
      const newCache = [...cache];
      newCache[cacheLineIndex] = word;
      setCache(newCache);
    }
  };

  const handleAssociativeMapping = (word) => {
    if (cache.includes(word)) {
      setHitCount(hitCount + 1);
    } else {
      setMissCount(missCount + 1);
      if (cache.includes(null)) {
        const newCache = [...cache];
        newCache[cache.indexOf(null)] = word;
        setCache(newCache);
      } else {
        applyReplacementPolicy(word);
      }
    }
  };

  const handleSetAssociativeMapping = (blockIndex, word) => {
    const setIndex = blockIndex % (cacheSize / 2);
    const setStart = setIndex * 2;
    const setEnd = setStart + 2;
    const cacheSet = cache.slice(setStart, setEnd);

    if (cacheSet.includes(word)) {
      setHitCount(hitCount + 1);
    } else {
      setMissCount(missCount + 1);
      if (cacheSet.includes(null)) {
        const newCache = [...cache];
        newCache[setStart + cacheSet.indexOf(null)] = word;
        setCache(newCache);
      } else {
        applyReplacementPolicy(word, setStart, setEnd);
      }
    }
  };

  const applyReplacementPolicy = (word, start = 0, end = cacheSize) => {
    if (replacementPolicy === "fifo") {
      const newCache = [...cache];
      newCache[start] = word;
      setCache(newCache);
    } else if (replacementPolicy === "lru") {
      const newCache = [...cache];
      newCache[end - 1] = word;
      setCache(newCache);
    }
  };

  return (
    <main className="grid grid-cols-[2fr,1fr]">
      <section>
        <div className="container mx-auto p-6">
          <h1 className="text-4xl text-center font-bold mb-6">
            Cache Mapping Simulator
          </h1>
          <h2 className="text-3xl  font-bold mb-8 text-blue-800">part-I</h2>

          <div className="mb-6">
            <label className="block mb-2 font-bold">
              Select Mapping Technique:
            </label>
            <select
              value={cacheType}
              onChange={(e) => setCacheType(e.target.value)}
              className="p-2 border rounded">
              <option value="direct">Direct Mapping</option>
              <option value="associative">Associative Mapping</option>
              <option value="setAssociative">Set-Associative Mapping</option>
            </select>
          </div>

          {cacheType !== "direct" && (
            <div className="mb-6">
              <label className="block mb-2 font-bold">
                Select Replacement Policy:
              </label>
              <select
                value={replacementPolicy}
                onChange={(e) => setReplacementPolicy(e.target.value)}
                className="p-2 border rounded">
                <option value="fifo">FIFO</option>
                <option value="lru">LRU</option>
              </select>
            </div>
          )}

          <div className="mb-6">
            <button
              onClick={() => handleRequest(getRandomWord())}
              className="p-2 bg-blue-500 text-white rounded">
              Make Processor Request
            </button>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-lg">Cache Content:</h3>
            <ul className="space-y-2">
              {cache.map((block, index) => (
                <li key={index} className="p-2 bg-gray-100 rounded">
                  Cache Line {index}: {block ? block : "Empty"}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <p>Cache Hits: {hitCount}</p>
            <p>Cache Misses: {missCount}</p>
          </div>
        </div>
      </section>

      <article className="p-6 bg-gray-100 text-gray-800 max-w-4xl mx-auto rounded-lg shadow-md overflow-y-scroll h-screen">
        <section>
          <section className="p-6 bg-gray-100 text-gray-800 max-w-4xl mx-auto rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-blue-600">
              Cache Mapping Simulator
            </h1>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-500">
                1. Direct Mapping
              </h2>
              <p className="mb-4 text-gray-700 leading-relaxed">
                <strong>Description:</strong> Each block in the main memory maps
                to a single, fixed cache line.
              </p>
              <p className="mb-4 text-gray-700 leading-relaxed">
                <strong>Formula:</strong>
                <br />
                <code className="bg-gray-200 px-2 py-1 rounded text-blue-600 font-mono">
                  Cache Line Index = (Block Number) % (Cache Size)
                </code>
              </p>
              <p className="mb-4 text-gray-700 leading-relaxed">
                If the block in the mapped cache line matches the requested word
                → <span className="text-green-600 font-semibold">Hit</span>.
                Otherwise →{" "}
                <span className="text-red-600 font-semibold">Miss</span>, and
                the cache line is overwritten.
              </p>
              <h3 className="text-xl font-semibold mb-2 text-blue-400">
                Example:
              </h3>
              <ul className="list-disc list-inside space-y-4">
                <li>
                  Initial Cache:{" "}
                  <code className="bg-gray-200 px-2 py-1 rounded text-blue-600 font-mono">
                    [null, null, null, null]
                  </code>
                </li>
                <li>
                  Main Memory:{" "}
                  <code className="bg-gray-200 px-2 py-1 rounded text-blue-600 font-mono">
                    ["Word 1", "Word 2", ..., "Word 16"]
                  </code>
                </li>
                <li>
                  <strong>Request "Word 3":</strong>
                  <div className="ml-4">
                    Cache Line Index ={" "}
                    <code className="bg-gray-200 px-2 py-1 rounded text-blue-600 font-mono">
                      (3) % (4) = 3
                    </code>
                    <br />
                    Cache Line 3 is empty →{" "}
                    <span className="text-red-600 font-semibold">Miss</span> →
                    Add "Word 3".
                    <br />
                    Cache After Update:{" "}
                    <code className="bg-gray-200 px-2 py-1 rounded text-blue-600 font-mono">
                      [null, null, null, "Word 3"]
                    </code>
                  </div>
                </li>
                <li>
                  <strong>Request "Word 7":</strong>
                  <div className="ml-4">
                    Cache Line Index ={" "}
                    <code className="bg-gray-200 px-2 py-1 rounded text-blue-600 font-mono">
                      (7) % (4) = 3
                    </code>
                    <br />
                    Cache Line 3 contains "Word 3" →{" "}
                    <span className="text-red-600 font-semibold">Miss</span> →
                    Replace with "Word 7".
                    <br />
                    Cache After Update:{" "}
                    <code className="bg-gray-200 px-2 py-1 rounded text-blue-600 font-mono">
                      [null, null, null, "Word 7"]
                    </code>
                  </div>
                </li>
                <li>
                  <strong>Request "Word 7":</strong>
                  <div className="ml-4">
                    Cache Line Index ={" "}
                    <code className="bg-gray-200 px-2 py-1 rounded text-blue-600 font-mono">
                      (7) % (4) = 3
                    </code>
                    <br />
                    Cache Line 3 contains "Word 7" →{" "}
                    <span className="text-green-600 font-semibold">Hit</span>.
                  </div>
                </li>
              </ul>
            </section>
          </section>
        </section>
        <section>
          <div className="p-6 bg-gray-100 rounded-lg shadow-md mb-10">
            <h1 className="text-2xl font-semibold mb-4 text-blue-500">
              2. Associative Mapping in Cache Simulator
            </h1>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                What is Associative Mapping?
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Associative mapping allows any block from the main memory to be
                placed in any cache line. Unlike direct mapping, it does not
                have a fixed line for each block, increasing flexibility but
                requiring a full search of the cache for hits or misses.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                How It Works
              </h2>
              <ol className="list-decimal list-inside text-gray-700 leading-relaxed">
                <li>
                  <strong>Hit Check:</strong> Search the entire cache to find
                  the requested word. If found →{" "}
                  <span className="text-green-600">Hit</span>.
                </li>
                <li>
                  <strong>Miss Handling:</strong> If not found:
                  <ul className="list-disc list-inside ml-4">
                    <li>
                      Place the word in the first available empty line if space
                      exists.
                    </li>
                    <li>
                      If the cache is full, use a replacement policy to decide
                      which block to replace.
                    </li>
                  </ul>
                </li>
              </ol>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                Replacement Policies
              </h2>
              <div className="mb-4">
                <h3 className="text-xl font-medium mb-2 text-gray-800">
                  FIFO (First-In-First-Out)
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  The block that has been in the cache the longest is replaced.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-gray-800">
                  LRU (Least Recently Used)
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  The block that hasn’t been used for the longest time is
                  replaced.
                </p>
              </div>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                Example Walkthrough
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Below is an example demonstrating how associative mapping works
                with both FIFO and LRU replacement policies.
              </p>

              <div className="mb-4">
                <h3 className="text-xl font-medium mb-2 text-gray-800">
                  Initial State
                </h3>
                <ul className="list-disc list-inside text-gray-700 leading-relaxed">
                  <li>
                    <strong>Cache Size:</strong> 4 lines (all empty initially).
                  </li>
                  <li>
                    <strong>Main Memory:</strong> ["Word 1", "Word 2", ...,
                    "Word 16"].
                  </li>
                  <li>
                    <strong>Replacement Policy:</strong> FIFO or LRU.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2 text-gray-800">
                  Requests
                </h3>
                <ul className="list-decimal list-inside text-gray-700 leading-relaxed">
                  <li>
                    <strong>Request "Word 3":</strong> Miss → Place in the first
                    available line.
                    <div className="p-2 bg-gray-50 rounded border mt-2">
                      Cache: ["Word 3", null, null, null]
                    </div>
                  </li>
                  <li>
                    <strong>Request "Word 7":</strong> Miss → Place in the next
                    available line.
                    <div className="p-2 bg-gray-50 rounded border mt-2">
                      Cache: ["Word 3", "Word 7", null, null]
                    </div>
                  </li>
                  <li>
                    <strong>Request "Word 8":</strong> Miss → Replace "Word 3"
                    (FIFO).
                    <div className="p-2 bg-gray-50 rounded border mt-2">
                      Cache: ["Word 8", "Word 7", null, null]
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                Try It Out
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Use the simulator to experiment with associative mapping, select
                replacement policies, and observe hits, misses, and cache
                updates in real-time.
              </p>
            </section>
          </div>
        </section>
        <section>
          <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-4 text-blue-500">
              3. Set-Associative Mapping in Cache Simulator
            </h1>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                What is Set-Associative Mapping?
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Set-associative mapping divides the cache into sets, each
                containing a fixed number of cache lines (e.g., 2-way, 4-way). A
                block from the main memory maps to a specific set but can occupy
                any line within that set. This approach balances the flexibility
                of associative mapping and the simplicity of direct mapping.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                How It Works
              </h2>
              <ol className="list-decimal list-inside text-gray-700 leading-relaxed">
                <li>
                  Divide the cache into{" "}
                  <span className="font-semibold">sets</span>, each containing a
                  fixed number of lines (e.g., 2 lines per set for 2-way
                  mapping).
                </li>
                <li>
                  Determine the set index for a block using its address:
                  <span className="bg-gray-200 p-1 rounded mx-1">
                    setIndex = blockIndex % numberOfSets
                  </span>
                </li>
                <li>
                  Search the determined set for the requested word:
                  <ul className="list-disc list-inside ml-4">
                    <li>
                      If found → <span className="text-green-600">Hit</span>.
                    </li>
                    <li>
                      If not found → <span className="text-red-600">Miss</span>.
                    </li>
                  </ul>
                </li>
                <li>
                  On a miss, replace a block in the set using a replacement
                  policy (e.g., FIFO or LRU).
                </li>
              </ol>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                Example Walkthrough
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Below is an example of 2-way set-associative mapping:
              </p>

              <div className="mb-4">
                <h3 className="text-xl font-medium mb-2 text-gray-800">
                  Initial Setup
                </h3>
                <ul className="list-disc list-inside text-gray-700 leading-relaxed">
                  <li>
                    <strong>Cache Size:</strong> 4 lines, divided into 2 sets (2
                    lines per set).
                  </li>
                  <li>
                    <strong>Main Memory:</strong> ["Word 1", "Word 2", ...,
                    "Word 16"].
                  </li>
                  <li>
                    <strong>Replacement Policy:</strong> FIFO or LRU.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2 text-gray-800">
                  Requests
                </h3>
                <ul className="list-decimal list-inside text-gray-700 leading-relaxed">
                  <li>
                    <strong>Request "Word 3":</strong>
                    <ul className="list-disc list-inside ml-4">
                      <li>
                        <strong>Set Index:</strong> Word 3 maps to
                        <span className="bg-gray-200 p-1 rounded mx-1">
                          setIndex = 3 % 2 = 1
                        </span>
                        .
                      </li>
                      <li>
                        <strong>Result:</strong> Miss → Place in the first
                        available line of Set 1.
                        <div className="p-2 bg-gray-50 rounded border mt-2">
                          Cache: [["Empty", "Empty"], ["Word 3", "Empty"]]
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Request "Word 7":</strong>
                    <ul className="list-disc list-inside ml-4">
                      <li>
                        <strong>Set Index:</strong> Word 7 maps to
                        <span className="bg-gray-200 p-1 rounded mx-1">
                          setIndex = 7 % 2 = 1
                        </span>
                        .
                      </li>
                      <li>
                        <strong>Result:</strong> Miss → Place in the next
                        available line of Set 1.
                        <div className="p-2 bg-gray-50 rounded border mt-2">
                          Cache: [["Empty", "Empty"], ["Word 3", "Word 7"]]
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Request "Word 9":</strong>
                    <ul className="list-disc list-inside ml-4">
                      <li>
                        <strong>Set Index:</strong> Word 9 maps to
                        <span className="bg-gray-200 p-1 rounded mx-1">
                          setIndex = 9 % 2 = 1
                        </span>
                        .
                      </li>
                      <li>
                        <strong>Result:</strong> Miss → Replace "Word 3" (FIFO
                        or LRU).
                        <div className="p-2 bg-gray-50 rounded border mt-2">
                          Cache: [["Empty", "Empty"], ["Word 9", "Word 7"]]
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                Try It Out
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Use the simulator to experiment with set-associative mapping.
                Choose different set sizes and observe how hits, misses, and
                replacement policies affect the cache's performance.
              </p>
            </section>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Summary Table</h2>
          <table className="table-auto border-collapse border border-gray-300 w-full text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 p-2">Mapping Type</th>
                <th className="border border-gray-300 p-2">
                  Replacement Policy
                </th>
                <th className="border border-gray-300 p-2">
                  Example Highlight
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">Direct Mapping</td>
                <td className="border border-gray-300 p-2">N/A</td>
                <td className="border border-gray-300 p-2">
                  Fixed cache line for each block.
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  Associative Mapping
                </td>
                <td className="border border-gray-300 p-2">FIFO, LRU</td>
                <td className="border border-gray-300 p-2">
                  Full cache search; FIFO/LRU applies when full.
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Set-Associative</td>
                <td className="border border-gray-300 p-2">FIFO, LRU</td>
                <td className="border border-gray-300 p-2">
                  Block maps to a set; FIFO/LRU applies within the set.
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </article>
    </main>
  );
};

export default CacheSimulator;
