import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wrap } from "../../components/style";
import Sidebar from "../../components/Sidebar";
import { Button, Form, Input, Layout, Modal, Table } from "antd";

import useAdvisorList from "../../api/aboutus/advisor/useAdvisorList";
import useAddAdvisor from "../../api/aboutus/advisor/useAddAdvisor";
import useDeleteAdvisor from "../../api/aboutus/advisor/useDeleteAdvisor";
import useEditAdvisor from "../../api/aboutus/advisor/useEditAdvisor";

const Advisor = () => {
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

  const { data, isLoading, refetch } = useAdvisorList();
  const { mutate, isSuccess } = useAddAdvisor();
  const { mutate: mutateEdit } = useEditAdvisor();
  const { mutate: mutateDelete } = useDeleteAdvisor();

  const listColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "date",
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Contents",
      dataIndex: "contents",
      key: "contents",
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
                name: record.name,
                contents: record.contents,
                position: record.position,
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
    }

    if (data?.data.success) {
      // console.log(data.data);
    }
  }, [data]);

  const handleAdd = async () => {
    await form
      .validateFields()
      .then(async (values) => {
        const { name, position, contents } = await values;
        try {
          mutate({
            name,
            contents,
            position,
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
        const { name, position, contents } = await values;

        const edit = {
          name,
          position,
          contents,
        };

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
          <h1>Advisor</h1>
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
        style={{ overflowY: "scroll" }}
        title={modalFor === "add" ? "Add New Advisor" : "Edit Advisor"}
        open={isModalOpen}
        // confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          {...formItemLayout}
          form={form}
          name={modalFor === "add" ? "addnotice" : "editnotice"}
          autoComplete="off"
        >
          {modalFor === "add" ? (
            <>
              <Form.Item
                label="Name"
                name="name"
                style={{ marginTop: "30px" }}
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
                label="Position"
                name="position"
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
                label="Contents"
                name="contents"
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                ]}
              >
                <TextArea rows={4} />
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
                label="Name"
                name="name"
                style={{ marginTop: "30px" }}
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
                label="Position"
                name="position"
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                ]}
              >
                <TextArea rows={4} />
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
              >
                <TextArea rows={4} />
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

export default Advisor;
