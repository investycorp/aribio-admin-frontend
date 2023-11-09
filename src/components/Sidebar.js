import React from "react";
import { Button, Layout, Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

function Sidebar({ pageName }) {
    const location = useLocation();
    const navigate = useNavigate();

    if (!window.localStorage.getItem("token")) {
        return <Navigate to='/login' state={{ from: location }} replace />;
    }

    return (
        <Sider
            style={{ padding: "10px 0", height: "100vh", overflow: "hidden" }}>
            <Menu theme='dark' defaultSelectedKeys={[pageName]} mode='inline'>
                <div>
                    <Button>ENG</Button>
                </div>
                <Menu.Item key='adminusers'>
                    <Link to='/adminusers'>Admin Users</Link>
                </Menu.Item>
                <Menu.Item key='history'>
                    <Link to='/history'>History</Link>
                </Menu.Item>
                <Menu.Item key='ci'>
                    <Link to='/ci'>CI</Link>
                </Menu.Item>
                <Menu.SubMenu title='IR/PR' key='irpr'>
                    <Menu.Item key='notice'>
                        <Link to='/notice'>Notice</Link>
                    </Menu.Item>
                    <Menu.Item key='press'>
                        <Link to='/press'>Press Release</Link>
                    </Menu.Item>
                    <Menu.Item key='media'>
                        <Link to='/media'>Media</Link>
                    </Menu.Item>
                </Menu.SubMenu>
                <Menu.Item key='career'>
                    <Link to='/career'>Career</Link>
                </Menu.Item>
                <Menu.SubMenu title='Contact' key='contact'>
                    <Menu.Item key='partner'>
                        <Link to='/partner'>Partner</Link>
                    </Menu.Item>
                    <Menu.Item key='contactus'>
                        <Link to='/contact'>Contact</Link>
                    </Menu.Item>
                </Menu.SubMenu>
                <Menu.Item key='pipeline'>
                    <Link to='/pipeline'>Pipeline</Link>
                </Menu.Item>
                <Menu.Item key='publication'>
                    <Link to='/publication'>Publication</Link>
                </Menu.Item>

                <Menu.Item key='links'>
                    <Link to='/link'>Link</Link>
                </Menu.Item>

                <Menu.Item
                    key='logout'
                    onClick={() => {
                        window.localStorage.removeItem("token");
                        window.localStorage.removeItem("role");
                        navigate("/");
                    }}>
                    Sign Out
                </Menu.Item>
            </Menu>
        </Sider>
    );
}

export default Sidebar;
