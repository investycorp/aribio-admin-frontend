import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { Wrap } from "../../components/style";
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

import useNoticeList from "../../api/irpr/notice/useNoticeList";
import useAddNotice from "../../api/irpr/notice/useAddNotice";
import useDeleteNotice from "../../api/irpr/notice/useDeleteNotice";
import useEditNotice from "../../api/irpr/notice/useEditNotice";

const Notice = () => {
	const { TextArea } = Input;
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [page, setPage] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalInfo, setModalInfo] = useState({});
	const [modalFor, setModalFor] = useState("");
	const [selectedFile, setSelectedFile] = useState(null);
	const [indication, setIndication] = useState([{ indication: "", phase: "" }]);
	const [len, setLen] = useState(1);
	const phaseList = [
		"IND-enabling",
		"Phase 1",
		"Phase 2",
		"Phase 3",
		"Approval",
	];

	const { data, isLoading, refetch } = useNoticeList();
	const { mutate, isSuccess } = useAddNotice();
	const { mutate: mutateEdit } = useEditNotice();
	const { mutate: mutateDelete } = useDeleteNotice();

	const listColumns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "idd",
		},
		{
			title: "Date",
			dataIndex: "date",
			key: "date",
		},
		{
			title: "Title",
			dataIndex: "title",
			key: "title",
			render: (title) =>
				title && title.length > 40 ? title.slice(0, 40) + "..." : title,
		},
		{
			title: "Image",
			dataIndex: "fileDto",
			key: "fileDto",
			render: (fileDto) => fileDto && <Badge status='success' />,
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
					}}
				>
					<Button
						style={{ marginRight: "10px" }}
						onClick={async (event) => {
							setModalFor("edit");
							event.stopPropagation();
							setSelectedFile();
							let editData = {
								id: record.id,
								title: record.title,
								contents: record.contents,
								fileDto: record.fileDto,
							};
							console.log("editData", editData);
							setIndication(editData.indication);
							await setModalInfo(editData);
							form.setFieldsValue(editData);
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
									handleDelete(record.id);
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
			// console.log(data.data);
		}
	}, [data]);

	const handleAdd = async () => {
		await form
			.validateFields()
			.then(async (values) => {
				const { title, contents } = await values;
				try {
					mutate({
						title,
						contents,
						file: selectedFile,
					});
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

	const handleEdit = async (id) => {
		await form
			.validateFields()
			.then(async (values) => {
				const { title, contents } = await values;

				const edit = {
					title,
					contents,
				};
				if (selectedFile) {
					edit.file = selectedFile;
				} else {
					edit.fileId = modalInfo.fileDto?.fileId;
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
		setIndication([{ indication: "", phase: "" }]);
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
			}}
		>
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
					}}
				>
					<h1>Notice</h1>
					<div
						style={{
							marginTop: "50px",
							width: "100%",
						}}
					>
						<Button
							type='primary'
							onClick={() => {
								setModalFor("add");
								setModalInfo({});
								setIsModalOpen(true);
								setSelectedFile();
							}}
						>
							Add Data
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
				title={modalFor === "add" ? "Add New Pipeline" : "Edit Pipeline"}
				open={isModalOpen}
				// confirmLoading={confirmLoading}

				onCancel={handleCancel}
				footer={null}
			>
				<Form
					{...formItemLayout}
					form={form}
					name={modalFor === "add" ? "addpipeline" : "editpipeline"}
					autoComplete='off'
				>
					{modalFor === "add" ? (
						<>
							<Form.Item
								label='Title'
								name='title'
								style={{ marginTop: "30px" }}
							>
								<Input />
							</Form.Item>
							<Form.Item label='Contents' name='contents'>
								<TextArea rows={4} />
							</Form.Item>
							<Form.Item label='Image Upload' style={{ margin: "20px 0" }}>
								<input type='file' id='file' onChange={handleFileChange} />
							</Form.Item>

							<p
								style={{
									display: "flex",
									flexDirection: "row",
									gap: "10px",
									justifyContent: "end",
									alignItems: "center",
								}}
							>
								<Button
									type='primary'
									onClick={(event) => {
										event.stopPropagation();

										handleAdd();
									}}
								>
									Confirm
								</Button>
								<Button onClick={handleCancel}>Cancel</Button>
							</p>
						</>
					) : (
						<>
							<Form.Item label='ID' name='id' style={{ marginTop: "30px" }}>
								{modalInfo.id}
							</Form.Item>
							<Form.Item
								label='Title'
								name='title'
								style={{ marginTop: "30px" }}
							>
								<Input />
							</Form.Item>
							<Form.Item label='Contents' name='contents'>
								<TextArea rows={4} />
							</Form.Item>
							<Form.Item label='Thumbnail'>
								{!selectedFile && modalInfo?.fileDto ? (
									<Image
										src={modalInfo?.fileDto?.fileUrl}
										width={150}
										height={150}
									/>
								) : (
									"No Image"
								)}
							</Form.Item>

							<Form.Item label='Image Upload'>
								<input type='file' id='file' onChange={handleFileChange} />
								<p>
									*Current Thumbnail will be replaced with New Image after
									[Confirm]
								</p>
							</Form.Item>

							<p
								style={{
									display: "flex",
									flexDirection: "row",
									gap: "10px",
									justifyContent: "end",
									alignItems: "center",
								}}
							>
								<Button
									disabled={false}
									type='primary'
									onClick={(event) => {
										event.stopPropagation();
										handleEdit(modalInfo.id);
									}}
								>
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

export default Notice;
