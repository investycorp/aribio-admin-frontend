import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import Language from "../../../atoms/Language";
import { useRecoilValue } from "recoil";
import { useLocation } from "react-router-dom";

const usePressList = () => {
  const location = useLocation();
  const language = useRecoilValue(Language);
  const lan = language === "ENG" ? "ENGLISH" : "KOREAN";
  const queryClient = useQueryClient();
  const { data, refetch } = useQuery(
    "pressList",
    () =>
      axios.get(`/admin/press-release/all`, {
        params: { language: lan },
      }),
    {
      initialData: queryClient.getQueryData("pressList"),
      onError: (error) => {
        console.log("error", error?.message);
        if (location.pathname.includes("press")) {
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

export default usePressList;
