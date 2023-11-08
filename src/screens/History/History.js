import React, { useState, useEffect } from "react";
import AdminInfo from "../../atoms/AdminInfo";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { Container, Wrap } from "../../components/style";
import Sidebar from "../../components/Sidebar";
import { Button, Form, Input, Layout, Modal, Radio, Table } from "antd";
import useHistoryList from "../../api/history/useHistoryList";
import useAddHistory from "../../api/history/useAddHistory ";
import useHistoryTypeList from "../../api/history/useHistoryTypeList ";
import HistoryType from "./HistoryType";
import useEditHistory from "../../api/history/useEditHistory ";
import useDeleteHistory from "../../api/history/useDeleteHistory";

const History = () => {
	const { Search } = Input;
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [adminInfo, setAdminInfo] = useRecoilState(AdminInfo);
	const [page, setPage] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalInfo, setModalInfo] = useState({});
	const [modalFor, setModalFor] = useState("");
	const [filteredList, setFilteredList] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const { data, isLoading, isError, error } = useHistoryList();
	const {
		data: typeData,
		isLoading: typeIsLoading,
		isError: typeIsError,
		error: typeError,
	} = useHistoryTypeList();
	const { mutate, isSuccess } = useAddHistory();
	const { mutate: mutateEdit, isSuccess: isSuccessEdit } = useEditHistory();
	const { mutate: mutateDelete, isSuccess: isSuccessDelete } =
		useDeleteHistory();
	const listColumns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "Date",
			dataIndex: "year",
			key: "year",
			sorter: (a, b) => a.year - b.year,
			// filter: [
			// 	{
			// 		text: "2023",
			// 		value: "2023",
			// 	}
			// ],
			render: (_, record) => (
				<span>
					{record?.year}.{record?.month}.{record?.day}
				</span>
			),
		},

		{
			title: "Category",
			dataIndex: "historyTypeId",
			key: "historyTypeId",
			render: (id) => {
				let type;
				typeData?.data?.dataList.map((item) => {
					if (item?.id === id) {
						type = ` ${item?.startYear} ~ ${item?.endYear}`;
					}
				});
				return type;
			},
		},
		{
			title: "Contents",
			dataIndex: "contents",
			key: "contents",
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
								year: record.year,
								month: record.month,
								day: record.day,
								historyTypeId: record.historyTypeId,
								contents: record.contents,
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

		if (data?.data.success) {
			// console.log(data.data);
			setFilteredList(data?.data?.dataList);
		}
		if (typeData?.data.success) {
		}
	}, [data]);

	const handleAdd = async () => {
		await form.validateFields().then(async (values) => {
			const { year, month, day, contents, historyTypeId } = await values;
			try {
				mutate({
					year,
					month,
					day,
					contents,
					historyTypeId,
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

	const handleEdit = async (id) => {
		await form.validateFields().then(async (values) => {
			const { year, month, day, contents, historyTypeId } = await values;
			const edit = await {
				year,
				month,
				day,
				contents,
				historyTypeId,
			};

			try {
				console.log("edit: ", edit);
				mutateEdit({ id, edit });
			} catch (error) {
				console.log(error);
			} finally {
				handleCancel();
			}
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
		setModalFor("");
	};

	const onSearch = (value) => {
		setSearchValue(value);
		let filteredData = data?.data?.dataList.filter((item) => {
			return (
				item.contents.toLowerCase().includes(value.toLowerCase()) ||
				item.year.toString().includes(value)
			);
		});
		setFilteredList(filteredData);
	};

	return (
		<Layout
			style={{
				width: "100vw",
				height: "100vh",
				display: "grid",
				gridTemplateColumns: "200px 1fr",
				overflow: "hidden",
			}}
		>
			<Sidebar page='history' />
			<Wrap style={{ width: "100%" }}>
				<h1 style={{ width: "100%", textAlign: "start" }}>History</h1>
				<HistoryType />

				<div
					style={{
						width: "100%",
					}}
				>
					<h2 style={{ width: "100%", textAlign: "start", margin: "20px 0" }}>
						History Contents
					</h2>
					<div>
						<Button
							type='primary'
							onClick={() => {
								setModalFor("add");
								setModalInfo({});
								setIsModalOpen(true);
							}}
						>
							Add Data
						</Button>
					</div>
					<div style={{ margin: "20px 0", width: "300px" }}>
						<Search
							placeholder='input search text'
							allowClear
							enterButton='Search'
							size='large'
							onSearch={onSearch}
						/>
					</div>
					<Table
						dataSource={filteredList}
						columns={listColumns}
						loading={isLoading}
						style={{ marginTop: "20px", width: "100%" }}
						rowKey={(record) => record.id}
					/>
				</div>
			</Wrap>
			<Modal
				title={modalFor === "add" ? "Add New Admin" : "Edit Admin User"}
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
								label='Year'
								name='year'
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
								label='Month'
								name='month'
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
								label='Date'
								name='day'
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
								label='Category'
								name='historyTypeId'
								rules={[
									{
										required: true,
										message: "Required field",
									},
								]}
							>
								<Radio.Group
									initialValue={modalInfo?.historyTypeId}
									buttonStyle='solid'
								>
									{typeData?.data?.dataList.map((item) => {
										if (item.id) {
											return (
												<Radio.Button key={item.id} value={item.id}>
													{item.startYear} ~ {item.endYear}
												</Radio.Button>
											);
										}
									})}
								</Radio.Group>
							</Form.Item>
							<Form.Item
								label='Contents'
								name='contents'
								rules={[
									{
										required: true,
										message: "Required field",
									},
								]}
							>
								<Input />
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
								label='Year'
								name='year'
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
								label='Month'
								name='month'
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
								label='Date'
								name='day'
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
								label='Category'
								name='historyTypeId'
								rules={[
									{
										required: true,
										message: "Required field",
									},
								]}
							>
								{/* <Input style={{ width: "70px" }} /> */}
								<Radio.Group
									initialValue={modalInfo?.historyTypeId}
									buttonStyle='solid'
								>
									{typeData?.data?.dataList.map((item) => {
										if (item.id) {
											return (
												<Radio.Button key={item.id} value={item.id}>
													{item.startYear} ~ {item.endYear}
												</Radio.Button>
											);
										}
									})}
								</Radio.Group>
							</Form.Item>
							<Form.Item
								layout='vertical'
								label='Contents'
								name='contents'
								rules={[
									{
										required: true,
										message: "Required field",
									},
								]}
							>
								<Input />
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

export default History;
