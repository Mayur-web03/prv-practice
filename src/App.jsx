import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import Catalogue from "./pages/Catalogue";
import ProductDetail from "./pages/ProductDetail";
import Dealer from "./pages/Dealer";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import useScrollTop from "./hooks/useScrollTop";

const ScrollToTop = () => {
  useScrollTop();
  return null;
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Navbar />

      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue/:category" element={<Catalogue />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/dealer" element={<Dealer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;