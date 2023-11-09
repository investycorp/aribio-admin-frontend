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
import usePartnerList from "../../api/contact/partner/usePartnerList";
import useAddPartner from "../../api/contact/partner/useAddPartner";
import useEditPartner from "../../api/contact/partner/useEditPartner";
import useDeletePartner from "../../api/contact/partner/useDeletePartner";

const Partner = () => {
    const { TextArea } = Input;
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState({});
    const [modalFor, setModalFor] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const { data, isLoading, refetch } = usePartnerList();
    const { mutate, isSuccess } = useAddPartner();
    const { mutate: mutateEdit } = useEditPartner();
    const { mutate: mutateDelete } = useDeletePartner();

    const listColumns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "idd",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "File Name",
            dataIndex: "fileDto",
            key: "fileDto",
            render: (fileDto) => <span>{fileDto.fileName}</span>,
        },

        {
            title: "",
            key: "action",
            render: (event, record) => (
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                    }}>
                    <Button
                        style={{ marginRight: "10px" }}
                        onClick={async (event) => {
                            setModalFor("edit");
                            event.stopPropagation();
                            setSelectedFile();
                            let editData = {
                                id: record.id,
                                name: record.name,
                                fileDto: record.fileDto,
                            };

                            await setModalInfo(editData);
                            form.setFieldsValue(editData);
                            setTimeout(() => {
                                setIsModalOpen(true);
                            }, 100);
                        }}>
                        Edit
                    </Button>
                    <Button
                        danger
                        onClick={(event) => {
                            event.stopPropagation();

                            Modal.confirm({
                                title: "Are you sure to delete this user?",

                                onOk() {
                                    handleDelete(record.id);
                                },
                                onCancel() {
                                    handleCancel();
                                },
                                okText: "Delete",
                                cancelText: "Cancel",
                            });
                        }}>
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    const formItemLayout = {
        labelCol: {
            xs: { span: 4 },
            sm: { span: 4 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 24 },
        },
    };

    useEffect(() => {
        if (!window.localStorage.getItem("token")) {
            navigate("/login");
            // navigate("/history");
        }

        if (data?.data.success) {
            // console.log(data.data);
        }
    }, [data]);

    const handleAdd = async () => {
        await form
            .validateFields()
            .then(async (values) => {
                const { name } = await values;

                try {
                    mutate({
                        file: selectedFile,
                        name,
                    });
                } catch (error) {
                    console.log(error);
                } finally {
                    // await refetch();
                    handleCancel();
                    // window.location.reload();
                }
            })
            .catch((error) => {
                window.alert("Please fill out all the required fields");
            });
    };

    const handleEdit = async (id) => {
        await form
            .validateFields()
            .then(async (values) => {
                const { name } = await values;

                const edit = {
                    name,
                };

                if (selectedFile) {
                    edit.file = selectedFile;
                } else {
                    edit.fileId = modalInfo.fileDto.fileId;
                }

                try {
                    mutateEdit({ id, edit });
                } catch (error) {
                    console.log(error);
                } finally {
                    handleCancel();
                }
            })
            .catch((error) => {
                window.alert("Please fill out all the required fields");
            });
    };

    const handleDelete = async (id) => {
        try {
            mutateDelete(id);
        } catch (error) {
            console.log(error);
        } finally {
            // await refetch();
            handleCancel();
            // window.location.reload();
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setModalInfo({});
        setIsModalOpen(false);
        setSelectedFile();
        setModalFor("");
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

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
                    <h1>Partners</h1>
                    <div
                        style={{
                            marginTop: "50px",
                            width: "100%",
                        }}>
                        <Button
                            type='primary'
                            onClick={() => {
                                setModalFor("add");
                                setModalInfo({});
                                setIsModalOpen(true);
                                setSelectedFile();
                            }}>
                            Add Partner
                        </Button>
                    </div>
                    <Table
                        dataSource={data?.data?.dataList}
                        columns={listColumns}
                        loading={isLoading}
                        style={{ marginTop: "20px", width: "100%" }}
                        rowKey={(record) => record.id}
                    />
                </div>
            </Wrap>
            <Modal
                width={800}
                style={{ overflowY: "scroll" }}
                title={
                    modalFor === "add"
                        ? "Add New Career post"
                        : "Edit Career post"
                }
                open={isModalOpen}
                // confirmLoading={confirmLoading}

                onCancel={handleCancel}
                footer={null}>
                <Form
                    {...formItemLayout}
                    form={form}
                    name={modalFor === "add" ? "addCareer" : "editCareer"}
                    autoComplete='off'>
                    {modalFor === "add" ? (
                        <>
                            <Form.Item
                                label='Name'
                                name='name'
                                rules={[
                                    {
                                        required: true,
                                        message: "Required field",
                                    },
                                ]}>
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label='Image Upload'
                                name='file'
                                style={{ margin: "20px 0" }}>
                                <input
                                    type='file'
                                    onChange={handleFileChange}
                                />
                            </Form.Item>

                            <p
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: "10px",
                                    justifyContent: "end",
                                    alignItems: "center",
                                }}>
                                <Button
                                    type='primary'
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleAdd();
                                    }}>
                                    Confirm
                                </Button>
                                <Button onClick={handleCancel}>Cancel</Button>
                            </p>
                        </>
                    ) : (
                        <>
                            <Form.Item
                                label='Name'
                                name='name'
                                rules={[
                                    {
                                        required: true,
                                        message: "Required field",
                                    },
                                ]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label='Image'>
                                <span>{modalInfo.fileDto?.fileName}</span>
                            </Form.Item>
                            <Form.Item
                                label='New Image Upload'
                                name='fileUpload'
                                style={{ margin: "20px 0" }}>
                                <input
                                    type='file'
                                    onChange={handleFileChange}
                                />
                            </Form.Item>
                            <p
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: "10px",
                                    justifyContent: "end",
                                    alignItems: "center",
                                }}>
                                <Button
                                    disabled={false}
                                    type='primary'
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleEdit(modalInfo.id);
                                    }}>
                                    Edit
                                </Button>
                                <Button onClick={handleCancel}>Cancel</Button>
                            </p>
                        </>
                    )}
                </Form>
            </Modal>
        </Layout>
    );
};

export default Partner;
