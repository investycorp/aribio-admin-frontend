import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecoilRoot, useRecoilState } from "recoil";
import { QueryClient, QueryClientProvider } from "react-query";
import axios from "axios";
import Login from "./screens/Login/Login";
import AdminUser from "./screens/AdminUser/AdminUser";
import History from "./screens/History/History";

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
                            <Route path='/login' element={<Login />} />
                            <Route path='/adminusers' element={<AdminUser />} />

                            <Route path='/history' element={<History />} />
                            {/* <Route path='*' element={<Login />} /> */}
                        </Routes>
                    </BrowserRouter>
                </QueryClientProvider>
            </RecoilRoot>
        </div>
    );
}

export default App;
