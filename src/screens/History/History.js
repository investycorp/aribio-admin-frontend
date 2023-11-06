import React, { useState, useEffect } from "react";
import AdminInfo from "../../atoms/AdminInfo";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { Container, Wrap } from "../../components/style";
import Sidebar from "../../components/Sidebar";
import { Layout } from "antd";

const History = () => {
    return (
        <Layout
            style={{
                width: "fit-content",
                minHeight: "100vh",
                flexDirection: "row",
            }}>
            <Sidebar />
            <Wrap>
                <h2>History</h2>
            </Wrap>
        </Layout>
    );
};

export default History;
