import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { useLocation } from "react-router-dom";
import Language from "../../../atoms/Language";
import { useRecoilState } from "recoil";

const useJobGroupList = () => {
  const location = useLocation();
  const [language, setLanguage] = useRecoilState(Language);
  const lan = language === "ENG" ? "ENGLISH" : "KOREAN";
  const queryClient = useQueryClient();
  const { data, refetch } = useQuery(
    "jobGroupList",
    () =>
      axios.get(`/admin/career/job-group`, {
        params: { language: lan },
      }),
    {
      initialData: queryClient.getQueryData("jobGroupList"),
      onError: (error) => {
        console.log("error", error?.message);
        if (location.pathname.includes("career")) {
          window.alert("Error occurred. Please reload or try again later.");
          window.location.reload();
        }
      },
    }
  );

  return { data, refetch };
};

export default useJobGroupList;
