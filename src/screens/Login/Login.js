import {
    Layout,
    Form,
    Input,
    Row,
    Col,
    Button,
    Spin,
    message as Message,
} from "antd";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

import useLogin from "../../api/auth/useLogin";
import AdminInfo from "../../atoms/AdminInfo";

const { Content } = Layout;

function Login() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const { mutate: login, data, isLoading } = useLogin();
    const [adminInfo, setAdminInfo] = useRecoilState(AdminInfo);

    useEffect(() => {
        if (window.localStorage.getItem("token")) {
            navigate("/adminusers");
        }
    }, []);

    useEffect(() => {
        if (data?.error) {
            Message.error(data.error.message);
            alert(data.error.message);
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("role");
        }

        if (data?.success === true && data.data) {
            window.localStorage.setItem("token", data.data?.token);
            window.localStorage.setItem("role", data.data?.accountType);
            // setAdminInfo(data.data?.accountType);

            if (location.state) {
                const { from } = location.state;
                navigate(from.pathname);
            } else {
                navigate("/adminusers");
            }
        }
    }, [data]);

    const onFinish = (formData) => {
        const { userId, password } = formData;
        login({ userId, password });
    };

    return (
        <Layout
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}>
            <Content
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}>
                <Row style={{ justifyContent: "center", alignItems: "center" }}>
                    <Col>
                        <Form
                            form={form}
                            name='login'
                            autoComplete='off'
                            onFinish={onFinish}>
                            <Form.Item
                                label='User Name'
                                name='userId'
                                rules={[
                                    {
                                        required: true,
                                        message: "User Name",
                                    },
                                ]}>
                                <Input style={{ width: "200px" }} />
                            </Form.Item>
                            <Form.Item
                                label='Password'
                                name='password'
                                rules={[
                                    {
                                        required: true,
                                        message: "User Password",
                                    },
                                ]}>
                                <Input.Password style={{ width: "200px" }} />
                            </Form.Item>
                            <Form.Item>
                                <Button type='primary' htmlType='submit'>
                                    {isLoading ? <Spin /> : "Sign In"}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
}

export default Login;
