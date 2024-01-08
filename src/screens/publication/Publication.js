import React, { useState, useEffect } from "react";
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
  Table,
} from "antd";

import usePublicationList from "../../api/publication/usePublicationList";
import useAddPublication from "../../api/publication/useAddPublication";
import useEditPublication from "../../api/publication/useEditPublication";
import useDeletePublication from "../../api/publication/useDeletePublication";

const Publication = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [modalFor, setModalFor] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const { data, isLoading, refetch } = usePublicationList();
  const { mutate, isSuccess } = useAddPublication();
  const { mutate: mutateEdit } = useEditPublication();
  const { mutate: mutateDelete } = useDeletePublication();

  const listColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: "10vw",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "10vw",
    },
    {
      title: "Journal",
      dataIndex: "journal",
      key: "journal",
      width: "25vw",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "40vw",
      render: (text) => <span>{text}</span>,
    },

    {
      title: "Link",
      dataIndex: "url",
      key: "url",
      render: (_, record) => record.url && <Badge status="success" />,
    },

    {
      title: "Thumbnail",
      dataIndex: "fileUrl",
      key: "fileUrl",
      render: (_, record) =>
        record?.fileDto?.fileUrl && <Badge status="processing" />,
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
                date: record.date,
                type: record.type,
                journal: record.journal,
                title: record.title,
                url: record.url,
                fileUrl: record.fileDto.fileUrl,
                fileId: record.fileDto.fileId,
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
        const { date, file, journal, title, type, url } = await values;
        try {
          mutate({
            date,
            file: selectedFile,
            journal,
            title,
            type,
            url,
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
        const { date, journal, title, type, url } = await values;

        const edit = { date, journal, title, type, url };
        if (selectedFile) {
          edit.file = selectedFile;
        } else {
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
    setSelectedFile();
    setModalFor("");

    const fileInput = document.getElementById("file");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
      if (!allowedExtensions.exec(file.name)) {
        alert("Invalid file type. Only JPG, JPEG, PNG files are allowed.");
        event.target.value = "";
        return;
      }
      setSelectedFile(file);
      form.setFieldValue("fileUrl", "");
    }
  };

  const handleFieldsChange = (_, allFields) => {
    const isAllFieldsValid = allFields.every(
      (field) => field.errors.length === 0
    );
    setIsFormValid(isAllFieldsValid);
  };

  const isValidDate = (value) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(value)) {
      return false;
    }

    const date = new Date(value);
    const timestamp = date.getTime();

    if (typeof timestamp !== "number" || Number.isNaN(timestamp)) {
      return false;
    }

    return date.toISOString().startsWith(value);
  };

  const dateValidationRule = {
    validator: (_, value) => {
      if (!value || isValidDate(value)) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Invalid date format. Use YYYY-MM-DD"));
    },
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
      <Sidebar page="adminusers" />
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
          <h1>Publication</h1>
          <div
            style={{
              marginTop: "50px",
              width: "100%",
            }}
          >
            <Button
              type="primary"
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
        title={modalFor === "add" ? "Add New Publication" : "Edit Publication"}
        open={isModalOpen}
        // confirmLoading={confirmLoading}

        onCancel={handleCancel}
        footer={null}
      >
        <Form
          {...formItemLayout}
          onFieldsChange={handleFieldsChange}
          form={form}
          name={modalFor === "add" ? "addpublication" : "editpublication"}
          autoComplete="off"
        >
          {modalFor === "add" ? (
            <>
              <Form.Item
                label="Date"
                name="date"
                style={{ marginTop: "30px" }}
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                  dateValidationRule,
                ]}
              >
                <Input style={{ width: "130px" }} placeholder="YYYY-MM-DD" />
              </Form.Item>
              <Form.Item
                label="Type"
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                ]}
              >
                <Radio.Group initialValue={modalInfo?.type} buttonStyle="solid">
                  <Radio.Button key="publication" value="PUBLICATION">
                    PUBLICATION
                  </Radio.Button>

                  <Radio.Button key="conference" value="CONFERENCE">
                    CONFERENCE
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label="Journal"
                name="journal"
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Title"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Link"
                name="url"
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={
                  <>
                    <span style={{ color: "#ff4d4f", fontSize: 14 }}>* </span>
                    <span>Thumbnail</span>
                  </>
                }
                style={{ margin: "20px 0" }}
              >
                <div>
                  <input type="file" id="file" onChange={handleFileChange} />
                  <span>(jpg, png only)</span>
                </div>
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
                  type="primary"
                  disabled={!isFormValid || !selectedFile}
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
              <Form.Item label="ID" name="id" style={{ marginTop: "30px" }}>
                {modalInfo.id}
              </Form.Item>
              <Form.Item
                label="Date"
                name="date"
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                  dateValidationRule,
                ]}
              >
                <Input
                  initialValue={modalInfo?.date}
                  style={{ width: "130px" }}
                  placeholder="YYYY-MM-DD"
                />
              </Form.Item>
              <Form.Item
                label="Type"
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                ]}
              >
                <Radio.Group initialValue={modalInfo?.type} buttonStyle="solid">
                  <Radio.Button key="publication" value="PUBLICATION">
                    PUBLICATION
                  </Radio.Button>

                  <Radio.Button key="conference" value="CONFERENCE">
                    CONFERENCE
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label="Journal"
                name="journal"
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Title"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Link"
                name="url"
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Thumbnail">
                {!selectedFile && modalInfo?.fileUrl ? (
                  <Image src={modalInfo?.fileUrl} width={100} height={150} />
                ) : (
                  "No Image"
                )}
              </Form.Item>

              <Form.Item label="New Thumbnail">
                <div>
                  <input type="file" id="file" onChange={handleFileChange} />
                  <span>(jpg, png only)</span>
                </div>
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
                  type="primary"
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

export default Publication;
