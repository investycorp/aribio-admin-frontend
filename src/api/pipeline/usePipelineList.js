import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import Language from "../../atoms/Language";
import { useLocation } from "react-router-dom";

const usePipelineList = () => {
  const location = useLocation();
  const language = useRecoilValue(Language);
  const lan = language === "ENG" ? "ENGLISH" : "KOREAN";
  const queryClient = useQueryClient();
  const { data, refetch } = useQuery(
    "pipelineList",
    () => axios.get(`/admin/pipeline`, { params: { language: lan } }),
    {
      initialData: queryClient.getQueryData("pipelineList"),
      onError: (error) => {
        console.log("error", error?.message);

        if (location.pathname.includes("pipeline")) {
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

export default usePipelineList;
