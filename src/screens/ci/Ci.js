import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { Container, Wrap } from "../../components/style";
import Sidebar from "../../components/Sidebar";
import {
  Button,
  Form,
  Image,
  Input,
  Layout,
  Modal,
  Table,
  message,
} from "antd";

import useCiList from "../../api/ci/useCiList";
import useEditCi from "../../api/ci/useEditCi";

const Ci = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [modalFor, setModalFor] = useState("");
  const [pngFile, setPngFile] = useState(null);
  const [aiFile, setAiFile] = useState(null);

  const { data, isLoading, refetch } = useCiList();
  const { mutate: mutateEdit } = useEditCi();

  const listColumns = [
    {
      title: "ID",
      dataIndex: "fileId",
      key: "fileId",
    },
    {
      title: "File Name",
      dataIndex: "fileName",
      key: "fileName",
    },
    {
      title: "File Type",
      dataIndex: "fileType",
      key: "fileType",
    },
    {
      title: "File URL",
      dataIndex: "fileUrl",
      key: "fileUrl",
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
          {/* <Button
            style={{ marginRight: "10px" }}
            onClick={async (event) => {
              event.stopPropagation();
              let editData = {
                
              };
              await setModalInfo(editData);
              form.setFieldsValue({
                name: record.name,
                id: record.id,
                role: record.role,
                userId: record.userId,
                contact: record.contact,
                department: record.department,
                jobGrade: record.jobGrade,
              });
              setTimeout(() => {
                setIsModalOpen(true);
              }, 100);
            }}
          >
            Edit
          </Button> */}
          {/* <Button
                        danger
                        onClick={(event) => {
                            event.stopPropagation();

                            Modal.confirm({
                                title: "Are you sure to delete this user?",

                                onOk() {
                                    // handleDeleteAdmin(record.id);
                                },
                                onCancel() {
                                    handleCancel();
                                },
                                okText: "Delete",
                                cancelText: "Cancel",
                            });
                        }}>
                        Delete
                    </Button> */}
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
      console.log(data.data);
    }
  }, [data]);

  const handleEdit = async (id) => {
    const edit = {};

    if (aiFile) {
      edit.aiFile = aiFile;
    } else {
      edit.aiFileId = modalInfo.ai.fileId;
    }

    if (pngFile) {
      edit.pngFile = pngFile;
    } else {
      edit.pngFileId = modalInfo.png.fileId;
    }

    try {
      mutateEdit({ id, edit });
    } catch (error) {
      console.log(error);
    } finally {
      handleCancel();
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setModalInfo({});
    setIsModalOpen(false);
    setAiFile(null);
    setPngFile(null);
    setModalFor("");
  };

  const handlePngFileChange = (event) => {
    setPngFile(event.target.files[0]);
  };
  
  const handleAiFileChange = (event) => {
    setAiFile(event.target.files[0]);
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
          <h1>CI</h1>
          <div
            style={{
              marginTop: "50px",
              width: "100%",
            }}
          >
            {/* <Button
              type="primary"
              onClick={() => {
                setModalFor("add");
                setModalInfo({});
                setIsModalOpen(true);
              }}
            >
              Add CI
            </Button> */}
            <Button
              type="primary"
              style={{ marginRight: "10px" }}
              onClick={async (event) => {
                event.stopPropagation();
                let editData = {};
                data?.data?.dataList[0]?.fileDtoList?.map((item) => {
                  if (item.fileType === "PNG") {
                    editData.png = item;
                  } else if (item.fileType === "AI") {
                    editData.ai = item;
                  }
                });
                editData.id = data?.data?.dataList[0]?.id;

                await setModalInfo(editData);
                form.setFieldsValue({});
                setTimeout(() => {
                  setIsModalOpen(true);
                }, 100);
              }}
            >
              Edit CI
            </Button>
          </div>
          <Table
            dataSource={data?.data?.dataList[0]?.fileDtoList}
            columns={listColumns}
            loading={isLoading}
            style={{ marginTop: "20px", width: "100%" }}
            rowKey={(record) => record.fileId}
          />
        </div>
      </Wrap>
      <Modal
        title={modalFor === "add" ? "Add New CI" : "Edit CI File"}
        open={isModalOpen}
        // confirmLoading={confirmLoading}

        onCancel={handleCancel}
        footer={null}
      >
        <Form
          {...formItemLayout}
          form={form}
          name={modalFor === "add" ? "addCi" : "editCi"}
          autoComplete="off"
        >
          {modalFor === "add" ? (
            <>
              {/* <Form.Item
                label="File Upload"
                name="fileUpload"
                style={{ margin: "20px 0" }}
              >
                <input type="file" onChange={handleFileChange} />
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
                    // handleAddAdmin();
                  }}
                >
                  Confirm
                </Button>
                <Button onClick={handleCancel}>Cancel</Button>
              </p> */}
            </>
          ) : (
            <>
              <Form.Item label="AI">
                {!aiFile && modalInfo?.ai?.fileId ? (
                  <span>{modalInfo?.ai?.fileName}</span>
                ) : (
                  "No Image"
                )}
              </Form.Item>

              <Form.Item label="New AI Image">
                <input type="file" id="file" onChange={handleAiFileChange} />
                <p>
                  *Current Image will be replaced with New Image after [Edit]
                </p>
              </Form.Item>
              <Form.Item label="PNG">
                {!pngFile && modalInfo?.png?.fileId ? (
                  <span>{modalInfo?.png?.fileName}</span>
                ) : (
                  "No Image"
                )}
              </Form.Item>

              <Form.Item label="New PNG Image">
                <input type="file" id="file" onChange={handlePngFileChange} />
                <p>
                  *Current Image will be replaced with New Image after [Edit]
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

export default Ci;
