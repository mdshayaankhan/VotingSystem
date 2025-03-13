import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VotingPage from "./VotingSystem";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VotingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
