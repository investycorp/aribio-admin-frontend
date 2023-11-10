import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { Container, Wrap } from "../../components/style";
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
	Table,
	message,
} from "antd";
import useLinkList from "../../api/link/useLinkList";
import useEditLink from "../../api/link/useEditLink";

const Link = () => {
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [page, setPage] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalInfo, setModalInfo] = useState({});
	const [modalFor, setModalFor] = useState("");
	const [dataList, setDataList] = useState([]);
	const [key, setKey] = useState("");
	const { data, isLoading, isError, isSuccess } = useLinkList();
	const { mutate: mutateEdit } = useEditLink();

	const listColumns = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Link",
			dataIndex: "url",
			key: "url",
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
							setKey(record.key);

							let editData = {
								key: record.key,
								name: record.name,
								url: record.url,
							};
							console.log("editData", editData);
							await setModalInfo(editData);
							form.setFieldsValue(editData);
							setTimeout(() => {
								setIsModalOpen(true);
							}, 100);
						}}
					>
						Edit
					</Button>
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
			navigate("/login");
			// navigate("/history");
		}

		if (data?.data.success) {
			setDataList([
				{
					key: "careerLinkedIn",
					name: "Career LinkedIn",
					url: data?.data?.dataList[0]?.careerLinkedIn,
				},
				{
					key: "goToHorizon",
					name: "Go To Horizon",
					url: data?.data?.dataList[0]?.goToHorizon,
				},
				{
					key: "memoReEngLink",
					name: "Memo:Re ENG",
					url: data?.data?.dataList[0]?.memoReEngLink,
				},
				{
					key: "memoReKorLink",
					name: "Memo:Re KOR",
					url: data?.data?.dataList[0]?.memoReKorLink,
				},
				{
					key: "memoReAndroidAppLink",
					name: "Memo:Re Android App",
					url: data?.data?.dataList[0]?.memoReAndroidAppLink,
				},
				{
					key: "memoReIosAppLink",
					name: "Memo:Re IOS App",
					url: data?.data?.dataList[0]?.memoReIosAppLink,
				},
			]);
		}
	}, [data]);

	const handleEdit = async () => {
		console.log(data?.data?.dataList[0].id);

		await form
			.validateFields()
			.then(async (values) => {
				const { name, url } = await values;

				// const edit = {
				// 	...data?.data?.dataList[0],
				// };
				const { id, ...edit } = data?.data?.dataList[0];

				edit[key] = url;
				const editId = id;
				console.log("EDIT: ", edit, editId);

				try {
					mutateEdit({ editId, edit });
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
					<h1>Links</h1>
					<Table
						dataSource={dataList}
						columns={listColumns}
						loading={isLoading}
						style={{ marginTop: "20px", width: "100%" }}
						rowKey={(record) => record?.name}
					/>
				</div>
			</Wrap>
			<Modal
				title={"Edit Link"}
				open={isModalOpen}
				// confirmLoading={confirmLoading}

				onCancel={handleCancel}
				footer={null}
			>
				<Form
					{...formItemLayout}
					form={form}
					name={"editLink"}
					autoComplete='off'
				>
					<Form.Item label='Name'>
						<span>{modalInfo.name}</span>
					</Form.Item>
					<Form.Item
						label='Link'
						name='url'
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
								handleEdit();
							}}
						>
							Edit
						</Button>
						<Button onClick={handleCancel}>Cancel</Button>
					</p>
				</Form>
			</Modal>
		</Layout>
	);
};

export default Link;
