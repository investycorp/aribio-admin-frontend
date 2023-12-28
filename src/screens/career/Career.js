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
import { Badge, Button, Form, Input, Layout, Modal, Select, Table } from "antd";

import useCareerList from "../../api/career/useCareerList";
import useJobGroupList from "../../api/career/jobGroup/useJobGroupList";
import useAddCareer from "../../api/career/useAddCareer";
import useDeleteCareer from "../../api/career/useDeleteCareer";
import useEditCareer from "../../api/career/useEditCareer";
import useAddJobGroup from "../../api/career/jobGroup/useAddJobGroup";

const Career = () => {
  const { TextArea } = Input;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [modalFor, setModalFor] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [newJobGroup, setNewJobGroup] = useState("");

  const { data, isLoading, refetch } = useCareerList();
  const { mutate, isSuccess } = useAddCareer();
  const { mutate: mutateEdit } = useEditCareer();
  const { mutate: mutateDelete } = useDeleteCareer();
  const { data: jobGroupData } = useJobGroupList();
  const { mutate: mutateJobGroup } = useAddJobGroup();

  const listColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "idd",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: "20vw",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: "10vw",
    },
    {
      title: "Job title",
      dataIndex: "jobGroupDto",
      key: "jobGroupDto",
      width: "30vw",
      render: (jobGroupDto) => (
        <span>
          {jobGroupDto.name}
        </span>
      ),
    },
    {
      title: "Image",
      dataIndex: "fileDtoList",
      key: "fileDtoList",
      render: (arr) => arr.length > 0 && <Badge status="success" />,
    },
    {
      title: "Link",
      dataIndex: "url",
      key: "url",
      width: "30vw",
      render: (text) => (
        <span>
          {text}
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
              setModalFor("edit");
              event.stopPropagation();
              setSelectedFile();
              let editData = {
                id: record.id,
                jobGroupDto: record?.jobGroupDto,
                jobGroupId: record?.jobGroupDto.id,
                location: record?.location,
                fileDtoList: record?.fileDtoList,
                url: record?.url,
                popupContents: record?.popupContents,
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
    if (jobGroupData?.data?.success) {
      // console.log(jobGroupData.data);
    }
  }, [data]);

  const handleAdd = async () => {
    await form
      .validateFields()
      .then(async (values) => {
        const { jobGroupId, location, popupContents, url } = await values;
        console.log("values", values);

        try {
          mutate({
            jobGroupId,
            location,
            popupContents,
            url,
            popupFile: selectedFile,
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
        const { location, jobGroupId, popupContents, url } = await values;

        const edit = {
          jobGroupId,
          location,
          popupContents,
          url,
        };

        if (selectedFile) {
          edit.popupFile = selectedFile;
        } else {
          edit.popupFileId = modalInfo?.fileDtoList[0]?.fileId;
        }
        console.log("edit", edit);

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
    setNewJobGroup("");

    const fileInput = document.getElementById("file");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
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
          <h1>Career</h1>
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
        title={modalFor === "add" ? "Add New Career post" : "Edit Career post"}
        open={isModalOpen}
        // confirmLoading={confirmLoading}

        onCancel={handleCancel}
        footer={null}
      >
        <Form
          {...formItemLayout}
          form={form}
          name={modalFor === "add" ? "addCareer" : "editCareer"}
          autoComplete="off"
        >
          {modalFor === "add" ? (
            <>
              <Form.Item
                label="Location"
                name="location"
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                ]}
                style={{ marginTop: "30px" }}
              >
                <Input width={100} />
              </Form.Item>
              <Form.Item
                label={
                  <>
                    <span style={{ color: "#ff4d4f", fontSize: 14 }}>* </span>
                    <span>Job Title</span>
                  </>
                }
                name="jobGroupId"
              >
                <Select
                  placeholder="Select Job Title"
                  options={jobGroupData?.data?.dataList?.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  onChange={(id) => {
                    form.setFieldsValue({ jobGroupId: id });
                  }}
                />
                <Form.Item label="Add New">
                  <Input
                    value={newJobGroup}
                    onChange={(e) => setNewJobGroup(e.target.value)}
                    style={{ width: "300px" }}
                  />
                  <Button
                    disabled={newJobGroup.trim().length === 0}
                    onClick={async () => {
                      try {
                        mutateJobGroup({
                          name: newJobGroup,
                        });
                      } catch (error) {
                        console.log(error);
                      } finally {
                        setNewJobGroup("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </Form.Item>
              </Form.Item>

              <Form.Item
                label="Link"
                name="url"
                initialValue={"https://"}
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
                label="Description"
                name="popupContents"
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
                label="Image Upload"
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
                label="Location"
                name="location"
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                ]}
                style={{ marginTop: "30px" }}
              >
                <Input width={100} />
              </Form.Item>
              <Form.Item
                label={
                  <>
                    <span style={{ color: "#ff4d4f", fontSize: 14 }}>* </span>
                    <span>Job Title</span>
                  </>
                }
                name="jobGroupId"
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                ]}
              >
                <Select
                  defaultValue={modalInfo.jobGroupDto?.id}
                  id="jobGroupId"
                  value={modalInfo.jobGroupDto?.id}
                  options={jobGroupData?.data?.dataList?.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  onChange={(id) => {
                    form.setFieldsValue({ jobGroupId: id });
                  }}
                />
                <Form.Item label="Add New">
                  <Input
                    value={newJobGroup}
                    onChange={(e) => setNewJobGroup(e.target.value)}
                    style={{ width: "300px" }}
                  />
                  <Button
                    onClick={async () => {
                      try {
                        mutateJobGroup({
                          name: newJobGroup,
                        });
                      } catch (error) {
                        console.log(error);
                      } finally {
                        setNewJobGroup(null);
                      }
                    }}
                  >
                    Add
                  </Button>
                </Form.Item>
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
                label="Description"
                name="popupContents"
                rules={[
                  {
                    required: true,
                    message: "Required field",
                  },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item label="Image">
                {!selectedFile && modalInfo?.fileUrl ? (
                  modalInfo.fileDtoList?.map((item) => (
                    <span key={"career file" + item.fileId}>
                      {item.fileName}
                    </span>
                  ))
                ) : (
                  <span>No Image</span>
                )}
              </Form.Item>

              <Form.Item label="New Image">
                <input type="file" id="file" onChange={handleFileChange} />
                <p>
                  *Current Thumbnail will be replaced with New Image after
                  [Edit]
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

export default Career;
