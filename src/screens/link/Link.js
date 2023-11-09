import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { Container, Wrap } from "../../components/style";
import Sidebar from "../../components/Sidebar";
import {
    Badge,
    Button,
    Form,
    Image,
    Input,
    Layout,
    Modal,
    Radio,
    Table,
    message,
} from "antd";

const Link = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState({});
    const [modalFor, setModalFor] = useState("");

    return (
        <Layout
            style={{
                width: "100vw",
                minHeight: "100vh",
                display: "grid",
                gridTemplateColumns: "200px 1fr",
            }}>
            <Sidebar page='adminusers' />
            <Wrap>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        width: "100%",
                        height: "fit-content",
                        padding: "0",
                    }}>
                    <h1>Media</h1>
                </div>
            </Wrap>
        </Layout>
    );
};

export default Link;
