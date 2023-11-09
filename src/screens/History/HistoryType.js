import React, { useState, useEffect } from "react";
import AdminInfo from "../../atoms/AdminInfo";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { Container, Wrap } from "../../components/style";
import { Button, Form, Input, Layout, Modal, Table } from "antd";
import useHistoryTypeList from "../../api/history/useHistoryTypeList ";
import useAddHistoryType from "../../api/history/useAddHistoryType";
import useDeleteHistoryType from "../../api/history/useDeleteHistoryType";
import useEditHistoryType from "../../api/history/useEditHistoryType";

const HistoryType = () => {
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [adminInfo, setAdminInfo] = useRecoilState(AdminInfo);
	const [page, setPage] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalInfo, setModalInfo] = useState({});
	const [modalFor, setModalFor] = useState("");

	const {
		data: typeData,
		isLoading: typeIsLoading,
		isError: typeIsError,
		error: typeError,
	} = useHistoryTypeList();

	const { mutate } = useAddHistoryType();
	const { mutate: mutateEdit } = useEditHistoryType();
	const { mutate: mutateDelete } = useDeleteHistoryType();

	const listColumns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "Start Year",
			dataIndex: "startYear",
			key: "startYear",
		},
		{
			title: "End Year",
			dataIndex: "endYear",
			key: "endYear",
		},
		{
			title: "Title",
			dataIndex: "title",
			key: "title",
		},
		{
			title: "Subtitle",
			dataIndex: "subtitle",
			key: "subtitle",
			render: (text) => (
				<span>
					{text?.slice(0, 45)}
					{text?.length > 45 && "..."}
				</span>
			),
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
							event.stopPropagation();
							let editData = {
								id: record.id,
								startYear: record.startYear,
								endYear: record.endYear,
								title: record.title,
								subtitle: record.subtitle,
							};
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

		if (typeData?.data.success) {
		}
	}, [typeData]);

	const handleAdd = async () => {
		await form
            .validateFields()
            .then(async (values) => {
                const { startYear, endYear, title, subtitle } = await values;
                try {
                    mutate({ startYear, endYear, title, subtitle });
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
            });;
	};

	const handleEdit = async (id) => {
		await form
            .validateFields()
            .then(async (values) => {
                const { startYear, endYear, title, subtitle } = await values;
                const edit = { startYear, endYear, title, subtitle };

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
            });;
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
		setModalFor("");
	};

	return (
		<>
			<div
				style={{
					width: "100%",
					height: "fit-content",
					justifyContent: "start",
					alignItems: "start",
					marginTop: "50px",
				}}
			>
				<div>
					<h2
						style={{ width: "100%", textAlign: "start", margin: "0 0 20px 0" }}
					>
						History Category
					</h2>
					<Button
						type='primary'
						onClick={() => {
							setModalFor("add");
							setModalInfo({});
							setIsModalOpen(true);
						}}
					>
						Add Category
					</Button>
				</div>
				<Table
					dataSource={typeData?.data?.dataList}
					columns={listColumns}
					loading={typeIsLoading}
					style={{ marginTop: "20px", width: "fit-content" }}
					rowKey={(record) => record.id}
				/>
			</div>

			<Modal
				title={modalFor === "add" ? "Add New Category" : "Edit Category"}
				open={isModalOpen}
				// confirmLoading={confirmLoading}
				width={700}
				onCancel={handleCancel}
				footer={null}
			>
				<Form
					{...formItemLayout}
					form={form}
					name={modalFor === "add" ? "addAdmin" : "editAdmin"}
					autoComplete='off'
				>
					{modalFor === "add" ? (
						<>
							<Form.Item
								label='Start Year'
								name='startYear'
								rules={[
									{
										required: true,
										message: "Required field",
									},
								]}
							>
								<Input autoFocus style={{ width: "70px" }} />
							</Form.Item>
							<Form.Item
								label='End Year'
								name='endYear'
								rules={[
									{
										required: true,
										message: "Required field",
									},
								]}
							>
								<Input style={{ width: "70px" }} />
							</Form.Item>
							<Form.Item
								label='Title'
								name='title'
								rules={[
									{
										required: true,
										message: "Required field",
									},
								]}
							>
								<Input style={{ width: "100%" }} />
							</Form.Item>
							<Form.Item
								label='Subtitle'
								name='subtitle'
								rules={[
									{
										required: true,
										message: "Required field",
									},
								]}
							>
								<Input style={{ width: "100%" }} />
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
							<Form.Item label='ID' style={{ margin: "0" }}>
								{modalInfo.id}
							</Form.Item>
							<Form.Item
								label='Start Year'
								name='startYear'
								rules={[
									{
										required: true,
										message: "Required field",
									},
								]}
							>
								<Input autoFocus style={{ width: "70px" }} />
							</Form.Item>
							<Form.Item
								label='End Year'
								name='endYear'
								rules={[
									{
										required: true,
										message: "Required field",
									},
								]}
							>
								<Input style={{ width: "70px" }} />
							</Form.Item>
							<Form.Item
								label='Title'
								name='title'
								rules={[
									{
										required: true,
										message: "Required field",
									},
								]}
							>
								<Input style={{ width: "100%" }} />
							</Form.Item>
							<Form.Item
								label='Subtitle'
								name='subtitle'
								rules={[
									{
										required: true,
										message: "Required field",
									},
								]}
							>
								<Input style={{ width: "100%" }} />
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
		</>
	);
};

export default HistoryType;
