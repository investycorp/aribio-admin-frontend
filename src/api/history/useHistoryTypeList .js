import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import Language from "../../atoms/Language";
import { useRecoilValue } from "recoil";

const useHistoryTypeList = () => {
  const language = useRecoilValue(Language);
  const lan = language === "ENG" ? "ENGLISH" : "KOREAN";
  const queryClient = useQueryClient();
  const { data, refetch } = useQuery(
    "historyTypeList",
    () => axios.get(`/admin/history/type`, { params: { language: lan } }),
    {
      initialData: queryClient.getQueryData("historyTypeList"),
      onError: (error) => {
        console.log("error", error?.message);
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("role");
        window.location.href = "/login";
      },
      retry: 1,
    }
  );

  return { data, refetch };
};

export default useHistoryTypeList;
