import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import Language from "../../atoms/Language";
import { useLocation } from "react-router-dom";

const usePopupList = () => {
  const location = useLocation();
  const language = useRecoilValue(Language);
  const lan = language === "ENG" ? "ENGLISH" : "KOREAN";
  const queryClient = useQueryClient();
  const { data, refetch } = useQuery(
    "popupList",
    () => axios.get(`/admin/main/pop-up`, { params: { language: lan } }),
    {
      initialData: queryClient.getQueryData("popupList"),
      onError: (error) => {
        console.log("error", error?.message);

        if (location.pathname.includes("popupline")) {
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

export default usePopupList;
