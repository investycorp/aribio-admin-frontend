import React from "react";
import { Button, Layout, Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import Language from "../atoms/Language";
import useCiList from "../api/ci/useCiList";
import usePipelineList from "../api/pipeline/usePipelineList";
import usePublicationList from "../api/publication/usePublicationList";
import useLinkList from "../api/link/useLinkList";
import useHistoryList from "../api/history/useHistoryList";
import useNoticeList from "../api/irpr/notice/useNoticeList";
import useHistoryTypeList from "../api/history/useHistoryTypeList ";
import usePressList from "../api/irpr/press/usePressList";
import useMediaList from "../api/irpr/media/useMediaList";
import usePartnerList from "../api/contact/partner/usePartnerList";
import useContactList from "../api/contact/contactus/useContactList";
import useFooterList from "../api/footer/useFooterList";
import useCareerList from "../api/career/useCareerList";
import useJobGroupList from "../api/career/jobGroup/useJobGroupList";

function Sidebar({ pageName }) {
  const [language, setLanguage] = useRecoilState(Language);
  const location = useLocation();
  const navigate = useNavigate();
  const [current, setCurrent] = React.useState(location.pathname.split("/")[1]);
  const { refetch: refetchCi } = useCiList();
  const { refetch: refetchPipeline } = usePipelineList();
  const { refetch: refetchPublication } = usePublicationList();
  const { refetch: refetchLink } = useLinkList();
  const { refetch: refetchHistory } = useHistoryList();
  const { refetch: refetchHistoryType } = useHistoryTypeList();
  const { refetch: refetchNotice } = useNoticeList();
  const { refetch: refetchPress } = usePressList();
  const { refetch: refetchMedia } = useMediaList();
  const { refetch: refetchPartner } = usePartnerList();
  const { refetch: refetchContactUs } = useContactList();
  const { refetch: refetchFooter } = useFooterList();
  const { refetch: refetchCareer } = useCareerList();
  const { refetch: refetchJobGroup } = useJobGroupList();

  const items = [
    {
      label: "Admin Users",
      key: "adminusers",
    },
    {
      label: "History",
      key: "history",
    },
    {
      label: "CI",
      key: "ci",
    },
    {
      label: "IR/PR",
      key: "irpr",
      children: [
        {
          label: "Notice",
          key: "notice",
        },
        {
          label: "Press Release",
          key: "press",
        },
        {
          label: "Media",
          key: "media",
        },
      ],
    },
    {
      label: "Career",
      key: "career",
    },
    {
      label: "Contact",
      key: "contact",
      children: [
        {
          label: "Partner",
          key: "partner",
        },
        {
          label: "Contact",
          key: "contactus",
        },
      ],
    },
    {
      label: "Pipeline",
      key: "pipeline",
    },
    {
      label: "Publication",
      key: "publication",
    },
    {
      label: "Link",
      key: "link",
    },
    {
      label: "Company Informaton",
      key: "company-info",
    },
    {
      label: "Sign Out",
      key: "logout",
      onClick: () => {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("role");
        navigate("/");
      },
    },
  ];

  if (!window.localStorage.getItem("token")) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  const onClick = (e) => {
    setCurrent(e.key);
    if (e.key === "logout") {
      navigate("/");
    } else {
      navigate(`/${e.key}`);
    }
  };

  const refetchAll = async () => {
    await refetchCi();
    await refetchPipeline();
    await refetchPublication();
    await refetchLink();
    await refetchHistory();
    await refetchHistoryType();
    await refetchNotice();
    await refetchPress();
    await refetchMedia();
    await refetchPartner();
    await refetchContactUs();
    await refetchFooter();
    await refetchCareer();
    await refetchJobGroup();
  };

  const onLanguageChange = async () => {
    await setLanguage(language === "ENG" ? "KOR" : "ENG");
    await refetchAll();
  };

  return (
    <Sider style={{ padding: "10px 0", height: "100vh", overflow: "hidden" }}>
      <Button
        type="primary"
        style={{ margin: "10px" }}
        onClick={onLanguageChange}
      >
        {language}
      </Button>
      <Menu
        theme="dark"
        defaultSelectedKeys={[pageName]}
        mode="inline"
        items={items}
        onClick={onClick}
        selectedKeys={[current]}
      />
    </Sider>
  );
}

export default Sidebar;
