import React, { useEffect, useState } from "react";
import { Button, Layout, Table, Input, Form, Modal, Radio, Upload, Image } from "antd";
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
    const [selectedFile, setSelectedFile] = useState(null);


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
                        {record.startDate} {record.startHour}:00:00
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
                        {record.endDate} {record.endHour}:00:00
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
                            setModalFor("edit");
                            
                            let editData = {
                                id: record.id,
                                title: record.title,
                                fileUrl: record.fileDto.fileUrl,
                                fileId: record.fileDto.fileId,
                                startDate: record.startDate,
                                startHour: record.startHour,
                                endDate: record.endDate,
                                endHour: record.endHour,
                                useStatus: record.useStatus.toString(),
                                closeButtonStatus: record.closeButtonStatus.toString(),
                                width: record.width,
                                length: record.length,
                                top: record.topSide,
                                left: record.leftSide,
                                link: record.link,
                                type: record.type,
                            };

                            setModalInfo(editData);
                            console.log(editData);
                            form.setFieldsValue(editData);
                            
                            setIsModalOpen(true);
                            
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
                const { 
                    title,
                    startDate,
                    startHour,
                    endDate,
                    endHour,
                    useStatus,
                    closeButtonStatus,
                    width,
                    length,
                    top,
                    left,
                    link,
                    type,
                } = await values;
                try {
                    mutate({
                        title,
                        file: selectedFile,
                        startDate,
                        startHour,
                        endDate,
                        endHour,
                        useStatus,
                        closeButtonStatus,
                        width,
                        length,
                        top,
                        left,
                        link,
                        type,
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
                console.log(error.values, error.errorFields.toString());
                window.alert("Please fill out all the required fields");
            });
    };

    const handleEdit = async (id) => {
        await form
            .validateFields()
            .then(async (values) => {
                const { 
                    title,
                    date,
                    startDate,
                    startHour,
                    endDate,
                    endHour,
                    useStatus,
                    closeButtonStatus,
                    width,
                    length,
                    top,
                    left,
                    link,
                    type,
                } = await values;

                const edit = {
                    title,
                    date,
                    startDate,
                    startHour,
                    endDate,
                    endHour,
                    useStatus,
                    closeButtonStatus,
                    width,
                    length,
                    top,
                    left,
                    link,
                    type,
                };

                if (selectedFile) {
                    edit.file = selectedFile;
                } else if (modalInfo.fileId) {
                    edit.fileId = modalInfo.fileId;
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
        setSelectedFile(null);
        setModalFor("");
    };

    const onSearch = (value) => {
        setSearchValue(value);
        let filteredData = data?.data?.dataList.filter((item) => {
            const lowerCaseValue = value.toLowerCase();
            return Object.keys(item).some(key => {
                const val = item[key];
                if (typeof val === 'string' || typeof val === 'number') {
                    return val.toString().toLowerCase().includes(lowerCaseValue);
                }
    
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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
            if (!allowedExtensions.exec(file.name)) {
              alert('Invalid file type. Only JPG, JPEG, PNG files are allowed.');
              event.target.value = '';
              return;
            }
            setSelectedFile(file);
            form.setFieldValue("fileUrl", "");
          }
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

    const isValidHour = (value) => {
        return /^(?:[0-9]|1[0-9]|2[0-3])$/.test(value);
    };
    
    const hourValidationRule = {
        validator: (_, value) => {
            const hour = parseInt(value, 10);
            if (!isNaN(hour) && isValidHour(value)) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('The value must be a number between 0 and 23'));
        }
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
                      <Form.Item label='Use Status' name='useStatus'
                            rules={[
                            {
                                required: true,
                                message: "Required field",
                            },
                        ]}>
                            <Radio.Group
                                buttonStyle='solid'>
                                <Radio.Button
                                    key='true'
                                    value='true'>
                                    YES
                                </Radio.Button>
                                <Radio.Button
                                    key='false'
                                    value='false'>
                                    NO
                                </Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label='Title'
                            name='title'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label='Start Date'
                            name='startDate'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                                dateValidationRule,
                            ]}>
                            <Input placeholder='YYYY-MM-DD' maxLength={10} style={{width: 150}} />
                        </Form.Item>
                        <Form.Item
                            label='Start Hour'
                            name='startHour'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                                hourValidationRule,
                            ]}>
                            <Input placeholder='0 ~ 23' maxLength={2} style={{ width: 80 }} />
                        </Form.Item>
                        <Form.Item
                            label='End Date'
                            name='endDate'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                                dateValidationRule,
                            ]}>
                            <Input placeholder='YYYY-MM-DD' maxLength={10} style={{width: 150}} />
                        </Form.Item>
                        <Form.Item
                            label='End Hour'
                            name='endHour'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                                hourValidationRule,
                            ]}>
                            <Input placeholder='0 ~ 23' maxLength={2} style={{ width: 80 }} />
                        </Form.Item>
                        <Form.Item label='Type' name='type'
                            rules={[
                            {
                                required: true,
                                message: "Required field",
                            },
                        ]}>
                            <Radio.Group
                                initialValue={modalInfo?.type}
                                buttonStyle='solid'>
                                <Radio.Button
                                    key='mobile'
                                    value='MOBILE'>
                                    MOBILE
                                </Radio.Button>
                                <Radio.Button
                                    key='pc'
                                    value='PC'>
                                    PC
                                </Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label='Popup Width'
                            name='width'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                                { pattern: /^\d+$/, message: 'Only numbers are allowed!' }
                            ]}>
                            <Input placeholder="(px)" style={{width: 100}} />             
                        </Form.Item>
                        <Form.Item
                            label='Popup Height'
                            name='length'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                                { pattern: /^\d+$/, message: 'Only numbers are allowed!' }
                            ]}>
                            <Input placeholder="(px)" style={{width: 100}} />
                        </Form.Item>
                        <Form.Item
                            label='Location (x)'
                            name='left'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                                { pattern: /^\d+$/, message: 'Only numbers are allowed!' }
                            ]}>
                            <Input placeholder="(px)" style={{width: 100}} />
                        </Form.Item>
                        <Form.Item
                            label='Location (y)'
                            name='top'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                                { pattern: /^\d+$/, message: 'Only numbers are allowed!' }
                            ]}>
                            <Input  style={{width: 100}} />
                        </Form.Item>
                        <Form.Item label="Popup Image">
                            <div>
                                <input
                                    type='file'
                                    id='file'
                                    onChange={handleFileChange}
                                />
                                <span>(jpg, png only)</span>
                            </div>
                        </Form.Item>
                        <Form.Item label='Close Button Status' name='closeButtonStatus'
                            rules={[
                            {
                                required: true,
                                message: "Required field",
                            },
                        ]}>
                            <Radio.Group
                                initialValue={true}
                                buttonStyle='solid'>
                                <Radio.Button
                                    key='true'
                                    value='true'>
                                    YES
                                </Radio.Button>
                                <Radio.Button
                                    key='false'
                                    value='false'>
                                    NO
                                </Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label='Link'
                            name='link'
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
                      <Form.Item label='Use Status' name='useStatus'
                            rules={[
                            {
                                required: true,
                                message: "Required field",
                            },
                        ]}>
                            <Radio.Group
                                buttonStyle='solid'>
                                <Radio.Button
                                    key='true'
                                    value='true'>
                                    YES
                                </Radio.Button>
                                <Radio.Button
                                    key='false'
                                    value='false'>
                                    NO
                                </Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label='Title'
                            name='title'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label='Start Date'
                            name='startDate'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                                dateValidationRule,
                            ]}>
                            <Input placeholder='YYYY-MM-DD' maxLength={10} style={{width: 150}} />
                        </Form.Item>
                        <Form.Item
                            label='Start Hour'
                            name='startHour'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                                hourValidationRule,
                            ]}>
                            <Input placeholder='0 ~ 23' maxLength={2} style={{ width: 80 }} />
                        </Form.Item>
                        <Form.Item
                            label='End Date'
                            name='endDate'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                                dateValidationRule,
                            ]}>
                            <Input placeholder='YYYY-MM-DD' maxLength={10} style={{width: 150}} />
                        </Form.Item>
                        <Form.Item
                            label='End Hour'
                            name='endHour'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                                hourValidationRule,
                            ]}>
                            <Input placeholder='0 ~ 23' maxLength={2} style={{ width: 80 }} />
                        </Form.Item>
                        <Form.Item label='Type' name='type'
                            rules={[
                            {
                                required: true,
                                message: "Required field",
                            },
                        ]}>
                            <Radio.Group
                                initialValue={modalInfo?.type}
                                buttonStyle='solid'>
                                <Radio.Button
                                    key='mobile'
                                    value='MOBILE'>
                                    MOBILE
                                </Radio.Button>
                                <Radio.Button
                                    key='pc'
                                    value='PC'>
                                    PC
                                </Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label='Popup Width'
                            name='width'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                                { pattern: /^\d+$/, message: 'Only numbers are allowed!' }
                            ]}>
                            <Input placeholder="(px)" style={{width: 100}} />             
                        </Form.Item>
                        <Form.Item
                            label='Popup Height'
                            name='length'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                                { pattern: /^\d+$/, message: 'Only numbers are allowed!' }
                            ]}>
                            <Input placeholder="(px)" style={{width: 100}} />
                        </Form.Item>
                        <Form.Item
                            label='Location (x)'
                            name='left'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                                { pattern: /^\d+$/, message: 'Only numbers are allowed!' }
                            ]}>
                            <Input placeholder="(px)" style={{width: 100}} />
                        </Form.Item>
                        <Form.Item
                            label='Location (y)'
                            name='top'
                            rules={[
                                {
                                    required: true,
                                    message: "Required field",
                                },
                                { pattern: /^\d+$/, message: 'Only numbers are allowed!' }
                            ]}>
                            <Input  style={{width: 100}} />
                        </Form.Item>
                        <Form.Item label="Popup Image">
                            <div>
                                <input
                                    type='file'
                                    id='file'
                                    onChange={handleFileChange}
                                />
                                <span>(jpg, png only)</span>
                            </div>
                            * Current Image will be replaced with New Image after [Edit]
                        </Form.Item>

                        <Form.Item label='Close Button Status' name='closeButtonStatus'
                            rules={[
                            {
                                required: true,
                                message: "Required field",
                            },
                        ]}>
                            <Radio.Group
                                initialValue={true}
                                buttonStyle='solid'>
                                <Radio.Button
                                    key='true'
                                    value='true'>
                                    YES
                                </Radio.Button>
                                <Radio.Button
                                    key='false'
                                    value='false'>
                                    NO
                                </Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label='Link'
                            name='link'
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