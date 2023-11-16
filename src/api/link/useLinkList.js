import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import Language from "../../atoms/Language";
import { useRecoilState } from "recoil";
import { useLocation } from "react-router-dom";

const useLinkList = () => {
  const location = useLocation();
  const [language, setLanguage] = useRecoilState(Language);
  const lan = language === "ENG" ? "ENGLISH" : "KOREAN";
  const queryClient = useQueryClient();
  const { data, refetch } = useQuery(
    "linkList",
    () => axios.get(`/admin/memo-re`, { params: { language: lan } }),
    {
      initialData: queryClient.getQueryData("linkList"),
      onError: (error) => {
        console.log("error", error?.message);

        if (location.pathname.includes("link")) {
          window.alert("Error occurred. Please reload or try again later.");
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("role");
          window.location.href = "/login";
        }
      },
      retry: 1,
    }
  );

  return { data, refetch };
};

export default useLinkList;
