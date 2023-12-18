import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { Container, Wrap } from "../../components/style";
import Sidebar from "../../components/Sidebar";
import {
    Alert,
    Badge,
    Button,
    Checkbox,
    Form,
    Input,
    Layout,
    Modal,
    Table,
    message,
} from "antd";
import useMediaList from "../../api/irpr/media/useMediaList";
import useAddMedia from "../../api/irpr/media/useAddMedia";
import useEditMedia from "../../api/irpr/media/useEditMedia";
import useDeleteMedia from "../../api/irpr/media/useDeleteMedia";

const Media = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState({});
    const [modalFor, setModalFor] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const { data, isLoading, refetch } = useMediaList();
    const { mutate, isError: errorAdd } = useAddMedia();
    const { mutate: mutateEdit, isError: errorEdit } = useEditMedia();
    const { mutate: mutateDelete } = useDeleteMedia();

    const listColumns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "title",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "URL Type",
            dataIndex: "url",
            key: "url",
            render: (url) =>
                url.includes("youtube") ? (
                    <span>
                        <Badge color='red' />
                        {"\t"}
                        YouTube
                    </span>
                ) : url.includes("iwinv") ? (
                    <span>
                        <Badge status='processing' />
                        {"\t"}
                        Streaming
                    </span>
                ) : (
                    <span>
                        <Badge status='success' />
                        {"\t"}
                        Server
                    </span>
                ),
        },
        {
            title: "Thumbnail",
            dataIndex: "fileDto",
            key: "fileDto",
            render: (fileDto) => fileDto?.fileId && <Badge status='success' />,
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
                                date: record.date,
                                title: record.title,
                                url: record.url,
                                fileDto: record.fileDto,
                            };
                            console.log("editData", editData);
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
        }

        if (data?.data.success) {
            console.log(data.data);
        }
    }, [data]);

    const handleAdd = async () => {
        await form
            .validateFields()
            .then(async (values) => {
                const { title, representative, url } = await values;

                const add = {
                    title,
                    representative: representative ? true : false,
                    url,
                };

                if (selectedFile) {
                    add.file = selectedFile;
                }

                try {
                    mutate(add);
                    if (!errorAdd) {
                        handleCancel();
                    }
                } catch (error) {
                    window.alert(error.data.message);
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
                const { title, representative, url } = await values;
                console.log(values);
                const edit = {
                    title,
                    representative,
                    url,
                };
                if (selectedFile) {
                    edit.file = selectedFile;
                } else if (modalInfo.fileDto?.fileId) {
                    edit.fileId = modalInfo.fileDto.fileId;
                }

                try {
                    mutateEdit({ id, edit });
                    if (!errorEdit) {
                        handleCancel();
                    }
                } catch (error) {
                    console.log(error);
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
        form.setFieldValue("fileUrl", "");
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
                    <h1>Media</h1>
                    <div
                        style={{
                            marginTop: "50px",
                            marginBottom: "30px",
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
                            Add Media
                        </Button>
                    </div>

                    <h2>Representative Media</h2>
                    <Table
                        dataSource={data?.data?.data?.representativeMediaKitDto ? [data.data.data.representativeMediaKitDto] : []}
                        columns={listColumns}
                        loading={isLoading}
                        style={{ marginTop: "20px", width: "100%" }}
                        rowKey={(record) => record.id}
                    />

                    <h2>Normal Media</h2>
                    <Table
                        dataSource={data?.data?.data?.mediaKitDtoList}
                        columns={listColumns}
                        loading={isLoading}
                        style={{ marginTop: "20px", width: "100%" }}
                        rowKey={(record) => record.id}
                    />
                </div>
            </Wrap>
            <Modal
                width={800}
                title={modalFor === "add" ? "Add New Media" : "Edit Media"}
                open={isModalOpen}
                // confirmLoading={confirmLoading}
                onCancel={handleCancel}
                footer={null}>
                <Form
                    {...formItemLayout}
                    form={form}
                    name={modalFor === "add" ? "addMedia" : "editMedia"}
                    autoComplete='off'>
                    {modalFor === "add" ? (
                        <>
                            <Form.Item
                                label='Title'
                                name='title'
                                rules={[
                                    {
                                        required: true,
                                        message: "Required field",
                                    },
                                ]}
                                style={{ marginTop: "30px" }}>
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label='Is this Main Video?'
                                name='representative'
                                valuePropName="checked"
                                >
                                <Checkbox
                                    style={{ width: "40px" }}
                                />
                            </Form.Item>
                            <Form.Item
                                label='URL Link'
                                name='url'
                                rules={[
                                    {
                                        required: true,
                                        message: "Required field",
                                    },
                                ]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label='Thumbnail Image'>
                                <input
                                    type='file'
                                    id='file'
                                    onChange={handleFileChange}
                                />
                            </Form.Item>
                            {/* <Form.Item
                                label='Upload Video'
                                name='file'
                                style={{ margin: "20px 0" }}>
                                <Input
                                    type='file'
                                    value={selectedFile}
                                    onChange={(e) => handleFileChange(e)}
                                />
                                <span>Upload to the server</span>
                            </Form.Item> */}

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
                                label='ID'
                                name='id'
                                style={{ marginTop: "30px" }}>
                                {modalInfo.id}
                            </Form.Item>
                            <Form.Item
                                label='Title'
                                name='title'
                                style={{ marginTop: "30px" }}
                                rules={[
                                    {
                                        required: true,
                                        message: "Required field",
                                    },
                                ]}>
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label='Is this Main Video?'
                                name='representative'
                                valuePropName="checked"
                                >
                                 <Checkbox
                                    style={{ width: "40px" }}
                                />
                            </Form.Item>
                            <Form.Item
                                label='Link'
                                name='url'
                                rules={[
                                    {
                                        required: true,
                                        message: "Required field",
                                    },
                                ]}>
                                <Input id='name' />
                            </Form.Item>
                            <Form.Item label='Thumbnail Image'>
                                <span>{modalInfo.fileDto?.fileName}</span>
                            </Form.Item>

                            <Form.Item label='New Thumbnail'>
                                <input
                                    type='file'
                                    id='file'
                                    onChange={handleFileChange}
                                />
                                <p style={{ margin: "10px 0" }}>
                                    * Current Image will be replaced with New
                                    Image after [Edit]
                                </p>
                            </Form.Item>

                            {/* <Form.Item label='Upload Video'>
                                <input
                                    type='file'
                                    id='file'
                                    onChange={handleFileChange}
                                />
                                <span>Upload to the server</span>
                            </Form.Item> */}
                            {/* <p style={{ margin: "10px 30px" }}>
                                * Current Link will be replaced with New
                                Uploaded Video Link after [Confirm]
                            </p> */}

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

export default Media;
