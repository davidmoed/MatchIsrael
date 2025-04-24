import "./App.css";
import "./styles/app.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import About from "./pages/about";
import Nonprofits from "./pages/nonprofits";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/nonprofits" element={<Nonprofits />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
