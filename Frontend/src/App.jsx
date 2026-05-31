import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Schedura from "./pages/Schedura";
import AIcomposer from "./pages/AIcomposer";
import Notfound from "./pages/Notfound";



export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Notfound />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/schedura" element={<Schedura />} />
          <Route path="/ai-composer" element={<AIcomposer />} />
        </Route>
      </Routes>
    </>
  );
}
