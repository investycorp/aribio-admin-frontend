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
  Select,
  Table,
} from "antd";
import TextArea from "antd/es/input/TextArea";

import useLeadershipList from "../../api/aboutus/leadership/useLeadershipList";
import useAddLeadership from "../../api/aboutus/leadership/useAddLeadership";
import useDeleteLeadership from "../../api/aboutus/leadership/useDeleteLeadership";
import useEditLeadership from "../../api/aboutus/leadership/useEditLeadership";

const Leadership = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [modalFor, setModalFor] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const { data, isLoading, refetch } = useLeadershipList();
  const { mutate, isError: errorAdd } = useAddLeadership();
  const { mutate: mutateEdit, isError: errorEdit } = useEditLeadership();
  const { mutate: mutateDelete } = useDeleteLeadership();

  const [types, setTypes] = useState(["CEO", "HEAD", "US"]);
  const [type, setType] = useState("CEO");
  const listColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Type",
      dataIndex: "leadershipType",
      key: "leadershipType",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Photo",
      dataIndex: "fileDto",
      key: "fileDto",
      render: (fileDto) => fileDto?.fileId && <Badge status="success" />,
    },
    {
      title: "Contents",
      dataIndex: "contents",
      key: "contents",
      width: "50vw",
      render: (text) => <span>{text}</span>,
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
              setSelectedFile(null);
              let editData = {
                id: record.id,
                position: record.position,
                name: record.name,
                leadershipType: record.leadershipType,
                contents: record.contents,
                fileDto: record.fileDto,
              };
              console.log("editData", editData);
              setType(record.leadershipType);
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
  }, [data]);

  const handleFieldsChange = (_, allFields) => {
    const isAllFieldsValid = allFields.every(
      (field) => field.errors.length === 0
    );
    setIsFormValid(isAllFieldsValid);
  };

  const handleAdd = async () => {
    await form
      .validateFields()
      .then(async (values) => {
        const { position, name, contents, leadershipType } = await values;

        const add = {
          position,
          name,
          contents,
          leadershipType,
          file: selectedFile,
        };

        try {
          mutate(add);
        } catch (error) {
          window.alert(error.data.message);
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
        const { position, name, contents, leadershipType } = await values;
        const edit = {
          position,
          name,
          contents,
          leadershipType,
        };

        if (selectedFile) {
          edit.file = selectedFile;
        } else if (modalInfo.fileDto?.fileId) {
          edit.fileId = modalInfo.fileDto.fileId;
        }
        console.log("VALUE:", edit);

        try {
          mutateEdit({ id, edit });
          if (!errorEdit) {
            handleCancel();
          }
        } catch (error) {
          console.log(error);
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
          <h1>Leadership</h1>
          <div
            style={{
              marginTop: "50px",
              marginBottom: "30px",
              width: "100%",
            }}
          >
            <Button
              type="primary"
              onClick={() => {
                setModalFor("add");
                setModalInfo({});
                setIsModalOpen(true);
                setSelectedFile(null);
              }}
            >
              Add Data
            </Button>
          </div>

          <Table
            dataSource={data?.data?.dataList ? data.data.dataList : []}
            columns={listColumns}
            loading={isLoading}
            style={{ marginTop: "20px", width: "100%" }}
            rowKey={(record) => record.id}
          />
        </div>
      </Wrap>
      <Modal
        width={800}
        title={modalFor === "add" ? "Add New Leadership" : "Edit Leadership"}
        open={isModalOpen}
        // confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          {...formItemLayout}
          form={form}
          name={modalFor === "add" ? "addLeadership" : "editLeadership"}
          onFieldsChange={handleFieldsChange}
          autoComplete="off"
        >
          {modalFor === "add" ? (
            <>
              <Form.Item
                label="Type"
                name="leadershipType"
                initialValue={"CEO"}
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                ]}
                style={{ marginTop: "30px" }}
              >
                <Select
                  placeholder="Select Type"
                  options={types?.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  onChange={(value) => {
                    setType(value);
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                ]}
                style={{ marginTop: "30px" }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Position"
                name="position"
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                ]}
                style={{ marginTop: "30px" }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Contents"
                name="contents"
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                ]}
                style={{ marginTop: "30px" }}
              >
                <TextArea
                  rows={4}
                  placeholder="You can wrap a line by typing \\n"
                />
              </Form.Item>
              <Form.Item
                label={
                  <>
                    {form.getFieldValue("leadershipType") !== "HEAD" && (
                      <span style={{ color: "#ff4d4f", fontSize: 14 }}>* </span>
                    )}

                    <span>New Photo</span>
                  </>
                }
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
                  disabled={
                    type !== "HEAD"
                      ? !selectedFile || !isFormValid
                      : !isFormValid
                  }
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
              <Form.Item label="ID" style={{ marginTop: "30px" }}>
                {modalInfo.id}
              </Form.Item>
              <Form.Item
                initialValue={modalInfo?.leadershipType}
                label="Type"
                name="leadershipType"
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                ]}
                style={{ marginTop: "30px" }}
              >
                <Select
                  placeholder="Select Type"
                  options={types?.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  onChange={(value) => {
                    setType(value);
                  }}
                />
              </Form.Item>
              <Form.Item
                initialValue={modalInfo?.name}
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                ]}
                style={{ marginTop: "30px" }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                initialValue={modalInfo?.position}
                label="Position"
                name="position"
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                ]}
                style={{ marginTop: "30px" }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                initialValue={modalInfo?.contents}
                label="Contents"
                name="contents"
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                ]}
                style={{ marginTop: "30px" }}
              >
                <TextArea
                  rows={4}
                  placeholder="You can wrap a line by typing \\n"
                />
              </Form.Item>
              <Form.Item label="Photo">
                <div>
                  {/* <span>{modalInfo.fileDto?.fileName}</span> */}
                  <Image src={modalInfo.fileDto?.fileUrl} width={200} />
                </div>
              </Form.Item>
              <Form.Item label="New Photo">
                <div>
                  <input type="file" id="file" onChange={handleFileChange} />
                  <span>(jpg, png only)</span>
                </div>
                <p style={{ margin: "10px 0" }}>
                  * Current Image will be replaced with New Image after [Edit]
                </p>
              </Form.Item>
              {/* <Form.Item label='Upload Video'>
                                <input
                                    type='file'
                                    id='file'
                                    onChange={handleFileChange}
                                />
                                <span>Upload to the server</span>
                            </Form.Item> */}
              {/* <p style={{ margin: "10px 30px" }}>
                                * Current Link will be replaced with New
                                Uploaded Video Link after [Confirm]
                            </p> */}

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
                  disabled={
                    type !== "HEAD"
                      ? modalInfo?.fileDto?.fileUrl
                        ? false
                        : !selectedFile
                      : false
                  }
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

export default Leadership;
