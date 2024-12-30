import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CacheSimulator from "./part1";
import MicroprogramControl from "./part2";
import Intro from "./intro";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="part1" element={<CacheSimulator />} />
        <Route path="/part2" element={<MicroprogramControl />} />
      </Routes>
    </Router>
  );
}

export default App;
