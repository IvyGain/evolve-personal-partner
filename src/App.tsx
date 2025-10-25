import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Goals from "@/pages/Goals";
import Coaching from "@/pages/Coaching";
import Architecture from "@/pages/Architecture";
import Layout from "@/components/Layout";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/coaching" element={<Coaching />} />
          <Route path="/architecture" element={<Architecture />} />
        </Routes>
      </Layout>
      <Toaster position="top-right" richColors />
    </Router>
  );
}
