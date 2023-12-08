import React, { useState, useEffect } from "react";
import AdminInfo from "../../atoms/AdminInfo";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { Container, Wrap } from "../../components/style";
import Sidebar from "../../components/Sidebar";
import { Button, Form, Input, Layout, Modal, Table } from "antd";
import useAdminList from "../../api/adminuser/useAdminList";
import useAddAdmin from "../../api/adminuser/useAddAdmin";
import useDeleteAdmin from "../../api/adminuser/useDeleteAdmin";
import useEditAdmin from "../../api/adminuser/useEditAdmin";

const AdminUser = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [adminInfo, setAdminInfo] = useRecoilState(AdminInfo);
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState({});
    const [modalFor, setModalFor] = useState("");
    const [newUsername, setNewUsername] = useState(null);
    const [changePassword, setChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState(null);
    const [passwordConfirm, setPasswordConfirm] = useState(null);
    const [passwordMatch, setPasswordMatch] = useState(false);
    const { data, isLoading, refetch } = useAdminList();
    const { mutate, isSuccess } = useAddAdmin();
    const { mutate: mutateDelete, isSuccess: isSuccessDelete } =
        useDeleteAdmin();
    const { mutate: mutateEdit, isSuccess: isSuccessEdit } = useEditAdmin();
    const adminListColumns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "User Name",
            dataIndex: "userId",
            key: "userId",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
        },
        {
            title: "Dept",
            dataIndex: "department",
            key: "department",
        },
        {
            title: "Job Title",
            dataIndex: "jobGrade",
            key: "jobGrade",
        },
        {
            title: "Contact",
            dataIndex: "contact",
            key: "contact",
        },
        // {
        //     title: "Password",
        //     dataIndex: "password",
        //     key: "password",
        //     render: (text) => <span>******</span>,
        // },
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
                            event.stopPropagation();
                            let editData = {
                                id: record.id,
                                role: record.role,
                                userId: record.userId,
                                contact: record.contact,
                                department: record.department,
                                jobGrade: record.jobGrade,
                            };
                            await setModalInfo(editData);
                            form.setFieldsValue({
                                name: record.name,
                                id: record.id,
                                role: record.role,
                                userId: record.userId,
                                contact: record.contact,
                                department: record.department,
                                jobGrade: record.jobGrade,
                            });
                            setTimeout(() => {
                                setIsModalOpen(true);
                            }, 100);
                        }}>
                        Edit
                    </Button>
                    {!["SUPER_ADMIN", "ROLE_SUPER_ADMIN"].includes(
                        record.role
                    ) && (
                        <Button
                            danger
                            onClick={(event) => {
                                event.stopPropagation();

                                Modal.confirm({
                                    title: "Are you sure to delete this user?",

                                    onOk() {
                                        handleDeleteAdmin(record.id);
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
                    )}
                </div>
            ),
        },
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
            // navigate("/login");
        } else if (adminInfo !== "SUPER_ADMIN") {
            // navigate("/history");
        }

        if (data?.data.success) {
            // console.log(data.data);
        }
    }, [data]);

    useEffect(() => {
        if (newPassword && passwordConfirm && passwordConfirm === newPassword)
            setPasswordMatch(true);
        else setPasswordMatch(false);
    }, [passwordConfirm, newPassword]);

    const handleAddAdmin = async () => {
        await form.validateFields().then(async (values) => {
            const { name, password, userId, contact, department, jobGrade } =
                await values;
            console.log("values: ", values);
            try {
                mutate({
                    name,
                    password,
                    userId,
                    contact,
                    department,
                    jobGrade,
                });
            } catch (error) {
                console.log(error);
            } finally {
                // await refetch();
                handleCancel();
                // window.location.reload();
            }
        });
    };

    const handleEditAdmin = async (id) => {
        await form
            .validateFields()
            .then(async (values) => {
                const {
                    name,
                    password,
                    userId,
                    contact,
                    department,
                    jobGrade,
                } = await values;
                console.log("values: ", values);
                const edit = await {
                    name: name,
                    userId: modalInfo.userId,
                    contact: contact,
                    department: department,
                    jobGrade: jobGrade,
                };
                if (
                    changePassword &&
                    newPassword &&
                    passwordConfirm &&
                    passwordMatch
                )
                    edit.password = newPassword;
                try {
                    console.log("edit: ", edit);
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

    const handleDeleteAdmin = async (id) => {
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
        setNewPassword("");
        setPasswordConfirm("");
        setPasswordMatch(false);
        setModalFor("");
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
                {["ROLE_SUPER_ADMIN", "SUPER_ADMIN"].includes(
                    window.localStorage.getItem("role")
                ) ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                            width: "100%",
                            height: "fit-content",
                            padding: "0",
                        }}>
                        <h1>Admin Users</h1>
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
                                    setNewPassword(null);
                                    setPasswordConfirm(null);
                                    setPasswordMatch(false);
                                    setIsModalOpen(true);
                                }}>
                                Add User
                            </Button>
                        </div>
                        <Table
                            dataSource={data?.data?.dataList}
                            columns={adminListColumns}
                            loading={isLoading}
                            style={{ marginTop: "20px", width: "100%" }}
                            rowKey={(record) => record.id}
                        />
                    </div>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            width: "auto",
                            height: "100%",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                        <h2
                            style={{
                                display: "inline-block",
                            }}>
                            User Has No Access to This Page.
                        </h2>
                    </div>
                )}
            </Wrap>
            <Modal
                title={modalFor === "add" ? "Add New Admin" : "Edit Admin User"}
                open={isModalOpen}
                // confirmLoading={confirmLoading}

                onCancel={handleCancel}
                footer={null}>
                <Form
                    {...formItemLayout}
                    form={form}
                    name={modalFor === "add" ? "addAdmin" : "editAdmin"}
                    autoComplete='off'>
                    {modalFor === "add" ? (
                        <>
                            <Form.Item
                                label='User ID'
                                name='userId'
                                rules={[
                                    {
                                        required: true,
                                        message: "Required field",
                                    },
                                ]}>
                                <Input />
                            </Form.Item>
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
                                label='Department'
                                name='department'
                                rules={[
                                    {
                                        required: true,
                                        message: "Required field",
                                    },
                                ]}>
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label='Job Title'
                                name='jobGrade'
                                rules={[
                                    {
                                        required: true,
                                        message: "Required field",
                                    },
                                ]}>
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label='Contact'
                                name='contact'
                                rules={[
                                    {
                                        required: true,
                                        message: "Required field",
                                    },
                                ]}>
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label='Password'
                                name='password'
                                rules={[
                                    {
                                        required: true,
                                        message: "Password is required",
                                    },
                                ]}>
                                <Input.Password
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                label='Confirm Password'
                                name='passwordConfirm'
                                rules={[
                                    {
                                        required: true,
                                        message: "Please confirm your password",
                                    },
                                ]}>
                                <Input.Password
                                    onChange={(e) => {
                                        setPasswordConfirm(e.target.value);
                                    }}
                                />
                            </Form.Item>
                            {(newPassword || passwordConfirm) &&
                                newPassword !== passwordConfirm && (
                                    <p
                                        style={{
                                            marginLeft: "5px",
                                            color: "red",
                                        }}>
                                        Password not matching!
                                    </p>
                                )}

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
                                    disabled={
                                        !newPassword ||
                                        !passwordConfirm ||
                                        !passwordMatch
                                    }
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleAddAdmin();
                                    }}>
                                    Confirm
                                </Button>
                                <Button onClick={handleCancel}>Cancel</Button>
                            </p>
                        </>
                    ) : (
                        <>
                            <Form.Item label='ID' style={{ margin: "0" }}>
                                {modalInfo.id}
                            </Form.Item>
                            <Form.Item label='User ID'>
                                {modalInfo.userId}
                            </Form.Item>

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
                                label='Department'
                                name='department'
                                rules={[
                                    {
                                        required: true,
                                        message: "Required field",
                                    },
                                ]}>
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label='Job Title'
                                name='jobGrade'
                                rules={[
                                    {
                                        required: true,
                                        message: "Required field",
                                    },
                                ]}>
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label='Contact'
                                name='contact'
                                rules={[
                                    {
                                        required: true,
                                        message: "Required field",
                                    },
                                ]}>
                                <Input />
                            </Form.Item>
                            <Button
                                type='default'
                                style={{ margin: "10px 0 0 0" }}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setChangePassword(!changePassword);
                                    setNewPassword("");
                                    setPasswordConfirm("");
                                    form.setFieldsValue({
                                        password: "",
                                        passwordConfirm: "",
                                    });
                                }}>
                                Password Reset
                            </Button>
                            {changePassword && (
                                <div style={{ padding: "10px" }}>
                                    <Form.Item
                                        label='New Password'
                                        name='password'
                                        rules={[
                                            {
                                                required: false,
                                                message: "Password is required",
                                            },
                                        ]}
                                        style={{ margin: "5px" }}>
                                        <Input.Password
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label='Confirm Password'
                                        name='passwordConfirm'
                                        rules={[
                                            {
                                                required: false,
                                                message:
                                                    "Please confirm your password",
                                            },
                                        ]}
                                        style={{ margin: "5px" }}>
                                        <Input.Password
                                            onChange={(e) => {
                                                setPasswordConfirm(
                                                    e.target.value
                                                );
                                            }}
                                        />
                                    </Form.Item>
                                    {newPassword &&
                                        passwordConfirm &&
                                        !passwordMatch && (
                                            <p
                                                style={{
                                                    marginLeft: "5px",
                                                    color: "red",
                                                }}>
                                                Password not matching!
                                            </p>
                                        )}
                                </div>
                            )}

                            <p
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: "10px",
                                    justifyContent: "end",
                                    alignItems: "center",
                                }}>
                                <Button
                                    disabled={
                                        !newPassword ||
                                        !passwordConfirm ||
                                        !passwordMatch
                                    }
                                    type='primary'
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleEditAdmin(modalInfo.id);
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

export default AdminUser;
