import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Wrap,
    FormInput,
    FormLabel,
    FormRowWrap,
} from "../../components/style";
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
    Select,
    Table,
} from "antd";
import useContactList from "../../api/contact/contactus/useContactList";

const Contact = () => {
    const { TextArea } = Input;
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState({});
    const [modalFor, setModalFor] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const { data, isLoading, refetch } = useContactList();
    // const { mutate, isSuccess } = useAddCareer();
    // const { mutate: mutateEdit } = useEditCareer();
    // const { mutate: mutateDelete } = useDeleteCareer();

    const listColumns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "idd",
        },
        {
            title: "Last Name",
            dataIndex: "lastName",
            key: "lastName",
        },
        {
            title: "first Name",
            dataIndex: "firstName",
            key: "firstName",
        },
        {
            title: "Affiliation",
            dataIndex: "affiliation",
            key: "affiliation",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },

        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Message",
            dataIndex: "message",
            key: "message",
        },
    ];

    useEffect(() => {
        if (!window.localStorage.getItem("token")) {
            navigate("/login");
            // navigate("/history");
        }

        if (data?.data.success) {
            // console.log(data.data);
        }
    }, [data]);

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
                    <h1>Contact Us</h1>
                    <Table
                        dataSource={data?.data?.dataList}
                        columns={listColumns}
                        loading={isLoading}
                        style={{ marginTop: "20px", width: "100%" }}
                        rowKey={(record) => record.id}
                    />
                </div>
            </Wrap>
        </Layout>
    );
};

export default Contact;
