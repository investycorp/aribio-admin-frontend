import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import Language from "../../atoms/Language";
import { useRecoilValue } from "recoil";
import { useLocation } from "react-router-dom";

const useCiList = () => {
  const location = useLocation();
  const language = useRecoilValue(Language);
  const lan = language === "ENG" ? "ENGLISH" : "KOREAN";
  const queryClient = useQueryClient();
  const { data, refetch } = useQuery(
    "ciList",
    () => axios.get(`/admin/ci`, { params: { language: lan } }),
    {
      initialData: queryClient.getQueryData("ciList"),
      onError: (error) => {
        console.log("error", error?.message);
        if (location.pathname.includes("ci")) {
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

export default useCiList;
