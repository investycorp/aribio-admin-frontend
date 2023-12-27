import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import Language from "../../atoms/Language";
import { useRecoilValue } from "recoil";
import { useLocation } from "react-router-dom";

const useCareerList = () => {
  const location = useLocation();
  const language = useRecoilValue(Language);
  const lan = language === "ENG" ? "ENGLISH" : "KOREAN";
  const queryClient = useQueryClient();
  const { data, refetch } = useQuery(
    "careerList",
    () => axios.get(`/admin/career/join-us`, { params: { language: lan } }),
    {
      initialData: queryClient.getQueryData("careerList"),
      onError: (error) => {
        console.log("error", error?.message);
        if (location.pathname.includes("career")) {
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

export default useCareerList;
