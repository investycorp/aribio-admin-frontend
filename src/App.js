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

const queryClient = new QueryClient();

function App() {
    const [initialized, setInitialized] = useState(false);
    const initialize = async () => {
        axios.defaults.baseURL = "https://api.aribio.boundary.team/";
        axios.interceptors.request.use(
            async (config) => {
                const token = window.localStorage.getItem("token");

                if (token && config.headers) {
                    config.headers.Authorization = `${token}`;
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
        <div className='App'>
            <RecoilRoot>
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>
                        <Routes>
                            <Route path='/' element={<Login />} />
                            <Route path='/adminusers' element={<AdminUser />} />

                            <Route path='/history' element={<History />} />
                            <Route path='/ci' element={<Ci />} />
                            <Route
                                path='/publication'
                                element={<Publication />}
                            />
                            <Route path='/pipeline' element={<Pipeline />} />
                            <Route path='/career' element={<Career />} />
                            <Route path='/partner' element={<Partner />} />
                            <Route path='/contact' element={<Contact />} />
                            <Route path='/media' element={<Media />} />
                            <Route path='/link' element={<Link />} />
                            <Route path='/login' element={<Login />} />
                        </Routes>
                    </BrowserRouter>
                </QueryClientProvider>
            </RecoilRoot>
        </div>
    );
}

export default App;
