import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
import Catalogue from "./pages/Catalogue";
import Footer from "./components/common/Footer";
function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogue/:category" element={<Catalogue />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
