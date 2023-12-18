import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { Container, Wrap } from "../../components/style";
import Sidebar from "../../components/Sidebar";
import { Badge, Button, Form, Image, Input, Layout, Modal, Table } from "antd";

import useFooterList from "../../api/footer/useFooterList";
import useEditFooter from "../../api/footer/useEditFooter";

const Footer = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState({});
    const [modalFor, setModalFor] = useState("");
    const [dataList, setDataList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [key, setKey] = useState("");
    const { data, isLoading, isError, isSuccess } = useFooterList();
    const { mutate: mutateEdit } = useEditFooter();

    const listColumns = [
        {
            title: "Type",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Contents",
            dataIndex: "contents",
            key: "contents",
        },
        // {
        // 	title: "",
        // 	key: "action",
        // 	render: (event, record) => (
        // 		<div
        // 			style={{
        // 				width: "100%",
        // 				display: "flex",
        // 				flexDirection: "row",
        // 				justifyContent: "space-evenly",
        // 			}}
        // 		>
        // 			<Button
        // 				style={{ marginRight: "10px" }}
        // 				onClick={async (event) => {
        // 					event.stopPropagation();
        // 					setKey(record.key);

        // 					let editData = {
        // 						key: record.key,
        // 						name: record.name,
        // 						url: record.url,
        // 					};
        // 					console.log("editData", editData);
        // 					await setModalInfo(editData);
        // 					form.setFieldsValue(editData);
        // 					setTimeout(() => {
        // 						setIsModalOpen(true);
        // 					}, 100);
        // 				}}
        // 			>
        // 				Edit
        // 			</Button>
        // 		</div>
        // 	),
        // },
    ];

    const formItemLayout = {
        labelCol: {
            xs: { span: 8 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 12 },
            sm: { span: 12 },
        },
    };

    useEffect(() => {
        if (!window.localStorage.getItem("token")) {
            navigate("/login");
            // navigate("/history");
        }

        if (data?.data.success) {
            console.log("data", data);
            setDataList([
                {
                    key: "usAddress",
                    name: "US Office",
                    contents: `
						${data?.data?.dataList[0]?.usAddress1},
						${data?.data?.dataList[0]?.usAddress2},
						${data?.data?.dataList[0]?.usAddress3},
					`,
                },
                {
                    key: "korAddress",
                    name: "Head Office",
                    contents: `
						${data?.data?.dataList[0]?.headAddress1},
						${data?.data?.dataList[0]?.headAddress2},
						${data?.data?.dataList[0]?.headAddress3},
					`,
                },
                {
                    key: "tel",
                    name: "Phone",
                    contents: data?.data?.dataList[0]?.tel,
                },
                {
                    key: "fax",
                    name: "Fax",
                    contents: data?.data?.dataList[0]?.fax,
                },
                {
                    key: "privacyPolicy",
                    name: "Privacy Policy",
                    contents: data?.data?.dataList[0]?.privacyPolicy,
                },
                {
                    key: "fileDto",
                    name: "Logo",
                    contents: (
                        <Image
                            src={data?.data?.dataList[0]?.fileDto.fileUrl}
                            style={{
                                width: "100px",
                                backgroundColor: "#121212",
                                padding: "10px",
                            }}
                        />
                    ),
                },
            ]);
        }
    }, [data]);

    const handleEdit = async (id) => {
        await form
            .validateFields()
            .then(async (values) => {
                const {
                    usAddress1,
                    usAddress2,
                    usAddress3,
                    headAddress1,
                    headAddress2,
                    headAddress3,
                    fax,
                    tel,
                    privacyPolicy,
                } = await values;

                const edit = {
                    usAddress1,
                    usAddress2,
                    usAddress3,
                    headAddress1,
                    headAddress2,
                    headAddress3,
                    fax,
                    tel,
                    privacyPolicy,
                };
                if (selectedFile) {
                    edit.file = selectedFile;
                } else {
                    edit.fileId = modalInfo?.fileId;
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

    const handleCancel = () => {
        form.resetFields();
        setModalInfo({});
        setIsModalOpen(false);
        setKey("");
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
                    <h1>Company Information</h1>
                    <div
                        style={{
                            marginTop: "50px",
                            width: "100%",
                        }}>
                        <Button
                            type='primary'
                            onClick={() => {
                                setModalFor("add");
                                const edit = {
                                    id: data?.data?.dataList[0]?.id,
                                    usAddress1:
                                        data?.data?.dataList[0]?.usAddress1,
                                    usAddress2:
                                        data?.data?.dataList[0]?.usAddress2,
                                    usAddress3:
                                        data?.data?.dataList[0]?.usAddress3,
                                    headAddress1:
                                        data?.data?.dataList[0]?.headAddress1,
                                    headAddress2:
                                        data?.data?.dataList[0]?.headAddress2,
                                    headAddress3:
                                        data?.data?.dataList[0]?.headAddress3,
                                    fax: data?.data?.dataList[0]?.fax,
                                    tel: data?.data?.dataList[0]?.tel,
                                    privacyPolicy:
                                        data?.data?.dataList[0]?.privacyPolicy,
                                    fileId: data?.data?.dataList[0]?.fileDto
                                        ?.fileId,
                                    fileDto: data?.data?.dataList[0]?.fileDto,
                                };
                                setModalInfo(edit);
                                form.setFieldsValue(edit);
                                setIsModalOpen(true);
                                setSelectedFile();
                            }}>
                            Edit Information
                        </Button>
                    </div>
                    <span>Language: {data?.data?.dataList[0]?.language}</span>
                    <Table
                        dataSource={dataList}
                        columns={listColumns}
                        loading={isLoading}
                        style={{ marginTop: "20px", width: "100%" }}
                        rowKey={(record) => record?.key}
                    />
                </div>
            </Wrap>
            <Modal
                title={"Edit Information"}
                open={isModalOpen}
                // confirmLoading={confirmLoading}

                onCancel={handleCancel}
                footer={null}>
                <Form
                    {...formItemLayout}
                    form={form}
                    name={"editInfo"}
                    autoComplete='off'>
                    <Form.Item
                        label={
                            <>
                                <span style={{color: '#ff4d4f', fontSize: 14}}>* </span>
                                <span>US Address</span>
                            </>
                        }
                    >
                        <Form.Item
                            name='usAddress1'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name='usAddress2'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name='usAddress3'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                            ]}>
                            <Input />
                        </Form.Item>
                    </Form.Item>
                    <Form.Item
                     label={
                        <>
                            <span style={{color: '#ff4d4f', fontSize: 14}}>* </span>
                            <span>Head Address</span>
                        </>
                    }
                    >
                        <Form.Item
                            name='headAddress1'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name='headAddress2'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name='headAddress3'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                            ]}>
                            <Input />
                        </Form.Item>
                    </Form.Item>
                    <Form.Item
                        label='Phone'
                        name='tel'
                        rules={[
                            {
                                required: true,
                                message: "Required field",
                            },
                        ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label='FAX'
                        name='fax'
                        rules={[
                            {
                                required: true,
                                message: "Required field",
                            },
                        ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label='Privacy Policy'
                        name='privacyPolicy'
                        rules={[
                            {
                                required: true,
                                message: "Required field",
                            },
                        ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Logo'>
                        {!selectedFile && modalInfo?.fileDto?.fileUrl ? (
                            <Image
                                src={modalInfo?.fileDto?.fileUrl}
                                width={100}
                                style={{
                                    backgroundColor: "#121212",
                                    padding: "10px",
                                }}
                            />
                        ) : (
                            "No Image"
                        )}
                    </Form.Item>

                    <Form.Item
                    
                        label={
                            <>
                                {
                                    !modalInfo?.fileDto?.fileUrl && (

                                        <span style={{color: '#ff4d4f', fontSize: 14}}>* </span>
                                        )
                                }
                                
                                <span>New Logo</span>
                            </>
                        }
                    >
                        <input
                            type='file'
                            id='file'
                            onChange={handleFileChange}
                        />
                        <p>
                            *Current Logo will be replaced with New Image after
                            [Edit]
                        </p>
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
                                handleEdit(modalInfo?.id);
                            }}>
                            Edit
                        </Button>
                        <Button onClick={handleCancel}>Cancel</Button>
                    </p>
                </Form>
            </Modal>
        </Layout>
    );
};

export default Footer;
