import React, { useEffect, useState } from "react";
import { Button, Layout, Table, Input, Form, Modal, Radio } from "antd";
import { Wrap } from "../../components/style";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import usePopupList from "../../api/popup/usePopupList";
import useAddPopup from "../../api/popup/useAddPopup";
import useEditPopup from "../../api/popup/useEditPopup";
import useDeletePopup from "../../api/popup/useDeletePopup";

const Popup = () => {
	const { Search } = Input;
    const navigate = useNavigate();
    const [form] = Form.useForm();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalInfo, setModalInfo] = useState({});
	const [modalFor, setModalFor] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);
    
	const [filteredList, setFilteredList] = useState([]);
    const { data, isLoading } = usePopupList();
    const { mutate, isSuccess } = useAddPopup();
    const { mutate: mutateEdit, isSuccess: isSuccessEdit } = useEditPopup();
    const { mutate: mutateDelete, isSuccess: isSuccessDelete } =
        useDeletePopup();

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

    const type = [
        {
            label: "Mobile",
            value: "MOBILE",
        },
        {
            label: "PC",
            value: "PC",
        }
    ]

	const listColumns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "Type",
			dataIndex: "type",
			key: "type",
		},
		{
			title: "Title",
			dataIndex: "title",
			key: "title",
		},
        {
			title: "Exposure Location",
			dataIndex: "location",
			key: "location",
            render: (event, record) => {
                return (
                    <span>
                        x : {record.topSide}, y : {record.leftSide}
                    </span>
                )
            }
		},
        {
			title: "Modal Size",
			dataIndex: "size",
			key: "size",
            render: (event, record) => {
                return (
                    <span>
                        {record.width} * {record.length}
                    </span>
                );
            }
		},
		{
			title: "Start Date",
			dataIndex: "startDate",
			key: "startDate",
            render: (event, record) => {
                return (
                    <span>
                        {record.startYear}/{record.startMonth}/{record.startDay} {record.startHour}:00:00
                    </span>
                );
            }
		},
		{
			title: "End Date",
			dataIndex: "endDate",
			key: "endDate",
            render: (event, record) => {
                return (
                    <span>
                        {record.endYear}/{record.endMonth}/{record.endDay} {record.endHour}:00:00
                    </span>
                );
            }
		},
        {
			title: "Language",
			dataIndex: "language",
			key: "language",
		},
        {
			title: "Link",
			dataIndex: "link",
			key: "link",
		},
        {
			title: "Close Button Status",
			dataIndex: "closeButtonStatus",
			key: "closeButtonStatus",
            render: (status) => status ? 'YES' : 'NO',
            
		},
        {
			title: "Use Status",
			dataIndex: "useStatus",
			key: "useStatus",
            render: (status) => status ? 'YES' : 'NO',
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
                    }}>
                    <Button
                        style={{ marginRight: "10px" }}
                        onClick={async (event) => {
                            event.stopPropagation();
                            let editData = {
                                id: record.id,
                                date: record.date,
                                historyTypeId: record.historyTypeId,
                                contents: record.contents,
                            };
                            await setModalInfo(editData);
                            form.setFieldsValue(editData);
                            setTimeout(() => {
                                setIsModalOpen(true);
                            }, 100);
                        }}>
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
                        }}>
                        Delete
                    </Button>
                </div>
            ),
        },
	];

    useEffect(() => {
        if (!window.localStorage.getItem("token")) {
            navigate("/login");
        }

        if (data?.data.success) {
            // console.log(data.data);
            setFilteredList(data?.data?.dataList);
        }

    }, [data]);

    const handleAdd = async () => {
        await form
            .validateFields()
            .then(async (values) => {
                const { date, contents, historyTypeId } = await values;

                try {
                    mutate({
                        date,
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
            })
            .catch((error) => {
                window.alert("Please fill out all the required fields");
            });
    };

    const handleEdit = async (id) => {
        await form
            .validateFields()
            .then(async (values) => {
                const { year, month, day, contents, historyTypeId } =
                    await values;
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
        setModalFor("");
    };

    const onSearch = (value) => {
        setSearchValue(value);
        let filteredData = data?.data?.dataList.filter((item) => {
            // 검색어를 소문자로 변환합니다.
            const lowerCaseValue = value.toLowerCase();
    
            // 객체의 각 키와 값을 검사합니다.
            return Object.keys(item).some(key => {
                const val = item[key];
    
                // 객체의 값이 문자열이나 숫자일 경우에만 검사합니다.
                if (typeof val === 'string' || typeof val === 'number') {
                    // 객체의 값도 소문자로 변환하여 포함 여부를 확인합니다.
                    return val.toString().toLowerCase().includes(lowerCaseValue);
                }
    
                // 객체의 값이 객체인 경우, 이를 재귀적으로 검사합니다.
                if (typeof val === 'object' && val !== null) {
                    return Object.keys(val).some(subKey => {
                        const subVal = val[subKey];
                        return subVal.toString().toLowerCase().includes(lowerCaseValue);
                    });
                }
    
                return false;
            });
        });
        setFilteredList(filteredData);
    };

    const handleFieldsChange = (_, allFields) => {
        const isAllFieldsValid = allFields.every(field => field.errors.length === 0);
        setIsFormValid(isAllFieldsValid);
    };

    const isValidDate = (value) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(value)) {
            return false;
        }

        const date = new Date(value);
        const timestamp = date.getTime();

        if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
            return false;
        }

        return date.toISOString().startsWith(value);
    };

    const dateValidationRule = {
        validator: (_, value) => {
            if (!value || isValidDate(value)) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('Invalid date format. Use YYYY-MM-DD'));
        },
    };

    return (
        <Layout
        style={{
            width: "100vw",
            height: "100vh",
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            overflow: "hidden",
        }}>
        <Sidebar page='popup' />
        <Wrap style={{ width: "100%" }}>
            <h1 style={{ width: "100%", textAlign: "start" }}>Popup</h1>
            <div
                style={{
                    width: "100%",
                }}>
                <h2
                    style={{
                        width: "100%",
                        textAlign: "start",
                        margin: "20px 0",
                    }}>
                    Popup Contents
                </h2>
                <div>
                    <Button
                        type='primary'
                        onClick={() => {
                            setModalFor("add");
                            setModalInfo({});
                            setIsModalOpen(true);
                        }}>
                        Add Popup
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
            title={modalFor === "add" ? "Add New Popup" : "Edit Popup"}
            open={isModalOpen}
            // confirmLoading={confirmLoading}
            width={700}
            onCancel={handleCancel}
            footer={null}>
            <Form
                {...formItemLayout}
                onFieldsChange={handleFieldsChange}
                form={form}
                name={modalFor === "add" ? "addPopup" : "editPopup"}
                autoComplete='off'>
                {modalFor === "add" ? (
                    <>
                        <Form.Item
                            label='Start Date'
                            name='startDate'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                                dateValidationRule
                            ]}>
                            <Input placeholder='YYYY-MM-DD' style={{width: 150}} />
                        </Form.Item>
                        <Form.Item
                            label='End Date'
                            name='endDate'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                                dateValidationRule
                            ]}>
                            <Input placeholder='YYYY-MM-DD' style={{width: 150}} />
                        </Form.Item>
                        <Form.Item
                            label='Type'
                            name='type'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                            ]}>
                            <Radio.Group
                                initialValue={modalInfo?.historyTypeId}
                                buttonStyle='solid'>
                                {/* {typeData?.data?.dataList.map((item) => {
                                    if (item.id) {
                                        return (
                                            <Radio.Button
                                                key={item.id}
                                                value={item.id}>
                                                {item.startYear} ~{" "}
                                                {item.endYear}
                                            </Radio.Button>
                                        );
                                    }
                                })} */}
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
                            ]}>
                            <Input />
                        </Form.Item>

                        <p
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "10px",
                                justifyContent: "end",
                                alignItems: "center",
                            }}>
                            <Button
                                type='primary'
                                disabled={!isFormValid}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleAdd();
                                }}>
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
                            label='Date'
                            name='date'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                                dateValidationRule,
                            ]}>
                            <Input placeholder="YYYY-MM-DD" style={{width: 150}} />
                        </Form.Item>
                        <Form.Item
                            label='Category'
                            name='historyTypeId'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                            ]}>
                    
                            <Radio.Group
                                initialValue={modalInfo?.historyTypeId}
                                buttonStyle='solid'>
                                {/* {typeData?.data?.dataList.map((item) => {
                                    if (item.id) {
                                        return (
                                            <Radio.Button
                                                key={item.id}
                                                value={item.id}>
                                                {item.startYear} ~{" "}
                                                {item.endYear}
                                            </Radio.Button>
                                        );
                                    }
                                })} */}
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
                            ]}>
                            <Input />
                        </Form.Item>

                        <p
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "10px",
                                justifyContent: "end",
                                alignItems: "center",
                            }}>
                            <Button
                                type='primary'
                                disabled={false}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleEdit(modalInfo.id);
                                }}>
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
}

export default Popup;