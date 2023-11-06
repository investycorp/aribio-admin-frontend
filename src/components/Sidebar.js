import React from "react";
import { Layout, Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

function Page({ pageName }) {
    const location = useLocation();
    const navigate = useNavigate();

    if (!window.localStorage.getItem("token")) {
        return <Navigate to='/login' state={{ from: location }} replace />;
    }

    return (
        <Sider>
            <Menu theme='dark' defaultSelectedKeys={[pageName]} mode='inline'>
                <Menu.Item
                    key='adminusers'
                    // icon={<UserOutlined />}
                >
                    <Link to='/adminusers'>Admin Users</Link>
                </Menu.Item>
                <Menu.Item key='history'>
                    <Link to='/history'>History</Link>
                </Menu.Item>
                <Menu.SubMenu title='Media' key='main'>
                    <Menu.Item key='mainVideos'>
                        <Link to='/main/videos'>Media</Link>
                    </Menu.Item>
                    <Menu.Item key='mainCategories'>
                        <Link to='/main/categories'>Media</Link>
                    </Menu.Item>
                </Menu.SubMenu>
                <Menu.Item key='links'>
                    <Link to='/'>Link</Link>
                </Menu.Item>

                <Menu.Item
                    key='logout'
                    onClick={() => {
                        window.localStorage.removeItem("token");
                        window.localStorage.removeItem("role");
                        navigate("/login");
                    }}>
                    Sign Out
                </Menu.Item>
            </Menu>
        </Sider>
    );
}

export default Page;
