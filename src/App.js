import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecoilRoot, useRecoilState } from "recoil";
import { QueryClient, QueryClientProvider } from "react-query";
import axios from "axios";
import Login from "./screens/Login/Login";
import AdminUser from "./screens/AdminUser/AdminUser";
import History from "./screens/History/History";
import Ci from "./screens/ci/Ci.js";
import Publication from "./screens/publication/Publication";
import Pipeline from "./screens/pipeline/Pipeline";
import Career from "./screens/career/Career";
import Partner from "./screens/contact/Partner";
import Contact from "./screens/contact/Contact";
import Media from "./screens/irpr/Media";
import Link from "./screens/link/Link";
import Notice from "./screens/irpr/Notice";
import Press from "./screens/irpr/Press";
import Footer from "./screens/footer/Footer";
import Popup from "./screens/popup/Popup.js";
import Leadership from "./screens/aboutus/Leadership.js";
import Advisor from "./screens/aboutus/Advisor.js";

const queryClient = new QueryClient();

function App() {
  const [initialized, setInitialized] = useState(false);
  const initialize = async () => {
    // axios.defaults.baseURL = "https://api.aribio.boundary.team/";
    axios.defaults.baseURL = "https://api.test-aribio.boundary.team/";
    axios.interceptors.request.use(
      async (config) => {
        const token = window.localStorage.getItem("token");

        if (token && config.headers) {
          config.headers.Authorization = `${token}`;
          // config.headers.AccessControlAllowOrigin = "*";
          // config.headers.AccessControlAllowMethods = "*";
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    setInitialized(true);
  };

  useEffect(() => {
    initialize();
  }, []);

  if (!initialized) {
    return null;
  }
  return (
    <div className="App">
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/adminusers" element={<AdminUser />} />
              <Route path="/popup" element={<Popup />} />
              <Route path="/history" element={<History />} />
              <Route path="/ci" element={<Ci />} />
              <Route path="/publication" element={<Publication />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/career" element={<Career />} />
              <Route path="/partner" element={<Partner />} />
              <Route path="/contactus" element={<Contact />} />
              <Route path="/media" element={<Media />} />
              <Route path="/notice" element={<Notice />} />
              <Route path="/press" element={<Press />} />
              <Route path="/link" element={<Link />} />
              <Route path="/leadership" element={<Leadership />} />
              <Route path="/advisor" element={<Advisor />} />
              <Route path="/company-info" element={<Footer />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Login />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </RecoilRoot>
    </div>
  );
}

export default App;
