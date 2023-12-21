import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import {
	Container,
	Wrap,
	FormInput,
	FormLabel,
	FormRowWrap,
} from "../../components/style";
import Sidebar from "../../components/Sidebar";
import {
	Button,
	Form,
	Input,
	Layout,
	Modal,
	Select,
	Table,
} from "antd";
import usePipelineList from "../../api/pipeline/usePipelineList";
import {
	MinusOutlined,
	PlusOutlined,
} from "@ant-design/icons";
import useAddPipeline from "../../api/pipeline/useAddPipeline";
import useDeletePipeline from "../../api/pipeline/useDeletePipeline";
import useEditPipeline from "../../api/pipeline/useEditPipeline";

const Pipeline = () => {
	const { TextArea } = Input;
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [page, setPage] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalInfo, setModalInfo] = useState({});
	const [modalFor, setModalFor] = useState("");
	const [selectedFile, setSelectedFile] = useState(null);
	const [isFormValid, setIsFormValid] = useState(false);
  const [allIndicationsFilled, setAllIndicationsFilled] = useState(false);

	const [indication, setIndication] = useState([{ indication: "", phase: 0, state: 0 }]);
	const [len, setLen] = useState(1);
	const phaseList = [
		"IND-enabling",
		"Phase 1",
		"Phase 2",
		"Phase 3",
		"Approval",
	];

	const { data, isLoading, refetch } = usePipelineList();
	const { mutate, isSuccess } = useAddPipeline();
	const { mutate: mutateEdit } = useEditPipeline();
	const { mutate: mutateDelete } = useDeletePipeline();

	const listColumns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "idd",
		},
		{
			title: "Drugcandidate",
			dataIndex: "drugCandidate",
			key: "drugCandidate",
		},
		{
			title: "Modality",
			dataIndex: "modality",
			key: "modality",
		},
		{
			title: "Target",
			dataIndex: "target",
			key: "target",
		},
		{
			title: "Pop-up Title",
			dataIndex: "popUpTitle",
			key: "popUpTitle",
			render: (text) => (
				<span>
					{text?.slice(0, 20)}
					{text?.length > 20 && "..."}
				</span>
			),
		},

		{
			title: "Indication/Phase",
			dataIndex: "indication",
			key: "indication",
			render: (_, record) =>
				record?.pipelineIndicationDtoList?.map((item, index) => (
					<span
						key={item.indication.slice(0, 5) + index}
						style={{ minWidth: "fit-content" }}
					>
						<span style={{ marginRight: "10px" }}>{item.indication}:</span>
						<span>{phaseList[parseInt(item.phase)]} / State {item.state}</span>
						<br />
					</span>
				)),
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
								drugCandidate: record.drugCandidate,
								modality: record.modality,
								target: record.target,
								popUpTitle: record.popUpTitle,
								popUpContents: record.popUpContents,
								indication: record.pipelineIndicationDtoList.map((item) => ({
									indication: item.indication,
									phase: item.phase,
									state: item.state,
								})),
							};
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
			// navigate("/history");
		}

		if (data?.data.success) {
			// console.log(data.data);
		}
	}, [data]);

	const handleAdd = async () => {
		await form
			.validateFields()
			.then(async (values) => {
				const { drugCandidate, modality, popUpContents, popUpTitle, target } =
					await values;
				try {
					mutate({
						drugCandidate,
						modality,
						popUpContents,
						popUpTitle,
						target,
						createPipelineIndicationDtoList: indication,
					});
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
			});
	};
	const handleEdit = async (id) => {
		await form
			.validateFields()
			.then(async (values) => {
				const { drugCandidate, modality, popUpContents, popUpTitle, target } =
					await values;

				const edit = {
					drugCandidate,
					modality,
					popUpContents,
					popUpTitle,
					target,
				};
				edit.createPipelineIndicationDtoList = indication;

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
		setIndication([{ indication: "", phase: "", state: 0 }]);
	};

	const handleDynamicChange = (e, index, key) => {
		let temp = [...indication];
		if (key === "phase") {
			temp[index][key] = e;
		} else if (key === 'state') {
			temp[index][key] = e;
		} else {
			temp[index][key] = e.target.value;
		}

		setIndication(temp);
	};

	const handleFieldsChange = (_, allFields) => {
		const isAllFieldsValid = allFields.every(field => field.errors.length === 0);
		if (modalFor === 'add') {
			setIsFormValid(isAllFieldsValid);
		}
	};

	useEffect(() => {
		const filled = indication.every(item => item.indication.trim() !== '');
		setAllIndicationsFilled(filled);
	}, [indication]); 

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
					<h1>Pipeline</h1>
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
					onFieldsChange={handleFieldsChange}
					name={modalFor === "add" ? "addpipeline" : "editpipeline"}
					autoComplete='off'
				>
					{modalFor === "add" ? (
						<>
							<Form.Item
								label='Drugcandidate'
								name='drugCandidate'
								rules={[
									{
											required: true,
											message: "Required field",
									},
								]}
								style={{ marginTop: "30px" }}
							>
								<Input style={{ width: "130px" }} />
							</Form.Item>
							<Form.Item label='Modality' name='modality'
								rules={[
									{
											required: true,
											message: "Required field",
									},
								]}
							>
								<Input />
							</Form.Item>
							<Form.Item label='Target' name='target'
								rules={[
									{
											required: true,
											message: "Required field",
									},
								]}
							>
								<Input />
							</Form.Item>

							<Form.Item label='Pop-Up Title' name='popUpTitle'
								rules={[
									{
											required: true,
											message: "Required field",
									},
								]}
							>
								<Input />
							</Form.Item>
							<Form.Item label='Pop-Up Contents' name='popUpContents'
								rules={[
									{
											required: true,
											message: "Required field",
									},
								]}
							>
								<TextArea rows={4} />
							</Form.Item>
							<Form.Item label='Indication/Phase'
								rules={[
									{
											required: true,
											message: "Required field",
									},
								]}
							></Form.Item>
							<div>
								{indication?.map((item, index) => (
									<FormRowWrap key={"indication input" + index}>
										<FormLabel style={{color: '#ff4d4f', fontSize: 14}}htmlFor={"indication" + index}>
											*
										</FormLabel>
										<FormLabel htmlFor={"indication" + index}>
											Indication:
										</FormLabel>
										<FormInput
											id={"indication" + index}
											value={indication[index].indication}
											onChange={(e) => {
												handleDynamicChange(e, index, "indication");
											}}
										/>
										<FormLabel htmlFor={"phase" + index}>Phase:</FormLabel>

										<Select
											defaultValue='0'
											style={{ width: 300 }}
											onChange={(value) =>
												handleDynamicChange(value, index, "phase")
											}
											options={[
												{
													value: "0",
													label: "IND-Enabled",
												},
												{
													value: "1",
													label: "Phase 1",
												},
												{
													value: "2",
													label: "Phase 2",
												},
												{
													value: "3",
													label: "Phase 3",
												},
												{
													value: "4",
													label: "Approval",
												},
											]}
										/>

										<FormLabel htmlFor={"state" + index}>State:</FormLabel>

										<Select
											defaultValue='0'
											style={{ width: 50 }}
											onChange={(value) =>
												handleDynamicChange(value, index, "state")
											}
											options={[
												{
													value: 0,
													label: "0",
												},
												{
													value: 1,
													label: "1",
												},
												{
													value: 2,
													label: "2",
												},
												{
													value: 3,
													label: "3",
												},
											]}
										/>
									</FormRowWrap>
								))}
								<FormRowWrap>
									<Button
										type='dashed'
										onClick={() => {
											setIndication([
												...indication,
												{ indication: "", phase: 0, state: 0 },
											]);
										}}
										style={{
											width: "fit-content",
											margin: "10px 0 10px 30px",
										}}
										icon={<PlusOutlined />}
									>
										Add
									</Button>
									<Button
										type='dashed'
										onClick={() => {
											setIndication(indication.slice(0, -1));
										}}
										style={{
											width: "fit-content",
											margin: "10px 0 10px 30px",
										}}
										icon={<MinusOutlined />}
									>
										Remove
									</Button>
								</FormRowWrap>
							</div>

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
									disabled={!isFormValid || !allIndicationsFilled}
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
								label='Drugcandidate'
								name='drugCandidate'
								rules={[
									{
											required: true,
											message: "Required field",
									},
								]}
								style={{ marginTop: "30px" }}
							>
								<Input style={{ width: "130px" }} />
							</Form.Item>
							<Form.Item label='Modality' name='modality'
								rules={[
									{
											required: true,
											message: "Required field",
									},
								]}
							>
								<Input />
							</Form.Item>
							<Form.Item label='Target' name='target'
								rules={[
									{
											required: true,
											message: "Required field",
									},
								]}
							>
								<Input />
							</Form.Item>

							<Form.Item label='Pop-Up Title' name='popUpTitle'
								rules={[
									{
											required: true,
											message: "Required field",
									},
								]}
							>
								<Input />
							</Form.Item>
							<Form.Item label='Pop-Up Contents' name='popUpContents'
								rules={[
									{
											required: true,
											message: "Required field",
									},
								]}
							>
								<TextArea rows={4} />
							</Form.Item>
							<Form.Item label='Indication/Phase'></Form.Item>
							<div>
								{indication?.map((item, index) => (
									<FormRowWrap key={"indication input" + index}>
										<FormLabel style={{color: '#ff4d4f', fontSize: 14}}htmlFor={"indication" + index}>
											*
										</FormLabel>
										<FormLabel htmlFor={"indication" + index}>
											Indication:
										</FormLabel>
										<FormInput
											id={"indication" + index}
											value={indication[index].indication}
											rules={[
												{
														required: true,
														message: "Required field",
												},
											]}
											onChange={(e) => {
												handleDynamicChange(e, index, "indication");
											}}
										/>
										<FormLabel htmlFor={"phase" + index}>Phase:</FormLabel>

										<Select
											value={indication[index].phase.toString()}
											style={{ width: 300 }}
											onChange={(value) =>
												handleDynamicChange(value, index, "phase")
											}
											options={[
												{
													value: "0",
													label: "IND-Enabled",
												},
												{
													value: "1",
													label: "Phase 1",
												},
												{
													value: "2",
													label: "Phase 2",
												},
												{
													value: "3",
													label: "Phase 3",
												},
												{
													value: "4",
													label: "Approval",
												},
											]}
										/>

										<FormLabel htmlFor={"state" + index}>State:</FormLabel>

										<Select
											value={indication[index].state}
											style={{ width: 50 }}
											onChange={(value) => {
												handleDynamicChange(value, index, "state")
											}
											}
											options={[
												{
													value: 0,
													label: "0",
												},
												{
													value: 1,
													label: "1",
												},
												{
													value: 2,
													label: "2",
												},
												{
													value: 3,
													label: "3",
												},
											]}
										/>
									</FormRowWrap>
								))}
								<FormRowWrap>
									<Button
										type='dashed'
										onClick={() => {
											setIndication([
												...indication,
												{ indication: "", phase: 0, state: 0 },
											]);
										}}
										style={{
											width: "fit-content",
											margin: "10px 0 10px 30px",
										}}
										icon={<PlusOutlined />}
									>
										Add
									</Button>
									<Button
										type='dashed'
										onClick={() => {
											setIndication(indication.slice(0, -1));
										}}
										style={{
											width: "fit-content",
											margin: "10px 0 10px 30px",
										}}
										icon={<MinusOutlined />}
									>
										Remove
									</Button>
								</FormRowWrap>
							</div>
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
									disabled={!allIndicationsFilled}
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

export default Pipeline;
