import React, { useState, useEffect } from "react";
import AdminInfo from "../../atoms/AdminInfo";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { Container, Wrap } from "../../components/style";
import Sidebar from "../../components/Sidebar";
import { Button, Form, Input, Layout, Modal, Table } from "antd";

const History = () => {
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [adminInfo, setAdminInfo] = useRecoilState(AdminInfo);
	const [page, setPage] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalInfo, setModalInfo] = useState({});
	const [modalFor, setModalFor] = useState("");
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
					}}
				>
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
						}}
					>
						Edit
					</Button>
					<Button
						danger
						onClick={(event) => {
							event.stopPropagation();

							Modal.confirm({
								title: "Are you sure to delete this user?",

								onOk() {
									// handleDeleteAdmin(record.id);
								},
								onCancel() {
									handleCancel();
								},
								okText: "Delete",
								cancelText: "Cancel",
							});
						}}
					>
						Delete
					</Button>
				</div>
			),
		},
	];

	// useEffect(() => {
	// 			if (!window.localStorage.getItem("token")) {
	// 				navigate("/login");
	// 			} else if (adminInfo !== "SUPER_ADMIN") {
	// 				// navigate("/history");
	// 			}

	// 			if (data?.data.success) {
	// 				// console.log(data.data);
	// 			}
	// 		}, [data]);

	const handleCancel = () => {
		form.resetFields();
		setModalInfo({});
		setIsModalOpen(false);
		setModalFor("");
	};
	return (
		<Layout
			style={{
				width: "fit-content",
				minHeight: "100vh",
				flexDirection: "row",
			}}
		>
			<Sidebar />
			<Wrap>
				<h2>History</h2>
			</Wrap>
		</Layout>
	);
};

export default History;
