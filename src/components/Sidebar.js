import React from "react";
import { Button, Layout, Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

function Sidebar({ pageName }) {
	const location = useLocation();
	const navigate = useNavigate();
	const [current, setCurrent] = React.useState(location.pathname.split("/")[1]);
	const items = [
		{
			label: "Admin Users",
			key: "adminusers",
		},
		{
			label: "History",
			key: "history",
		},
		{
			label: "CI",
			key: "ci",
		},
		{
			label: "IR/PR",
			key: "irpr",
			children: [
				{
					label: "Notice",
					key: "notice",
				},
				{
					label: "Press Release",
					key: "press",
				},
				{
					label: "Media",
					key: "media",
				},
			],
		},
		{
			label: "Career",
			key: "career",
		},
		{
			label: "Contact",
			key: "contact",
			children: [
				{
					label: "Partner",
					key: "partner",
				},
				{
					label: "Contact",
					key: "contactus",
				},
			],
		},
		{
			label: "Pipeline",
			key: "pipeline",
		},
		{
			label: "Publication",
			key: "publication",
		},
		{
			label: "Link",
			key: "link",
		},
		{
			label: "Company Informaton",
			key: "company-info",
		},
		{
			label: "Sign Out",
			key: "logout",
			onClick: () => {
				window.localStorage.removeItem("token");
				window.localStorage.removeItem("role");
				navigate("/");
			},
		},
	];

	if (!window.localStorage.getItem("token")) {
		return <Navigate to='/login' state={{ from: location }} replace />;
	}
	const onClick = (e) => {
		setCurrent(e.key);
		navigate(`/${e.key}`);
	};

	return (
		<Sider style={{ padding: "10px 0", height: "100vh", overflow: "hidden" }}>
			<Menu
				theme='dark'
				defaultSelectedKeys={[pageName]}
				mode='inline'
				items={items}
				onClick={onClick}
				selectedKeys={[current]}
			/>
		</Sider>
	);
}

export default Sidebar;
