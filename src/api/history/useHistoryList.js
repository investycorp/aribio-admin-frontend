import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import Language from "../../atoms/Language";
import { useRecoilState } from "recoil";

const useHistoryList = () => {
    const [language, setLanguage] = useRecoilState(Language);
    const lan = language === "ENG" ? "ENGLISH" : "KOREAN";
    const queryClient = useQueryClient();
    const { data, refetch } = useQuery(
        "historyList",
        () => axios.get(`/admin/history`, { params: { language: lan } }),
        {
            initialData: queryClient.getQueryData("historyList"),
            onError: (error) => {
                console.log("error", error?.message);
                window.localStorage.removeItem("token");
                window.localStorage.removeItem("role");
                window.location.href = "/login";
            },
            retry: 1,
        }
    );
    // console.log("History data: ", data);

    return { data, refetch };
};

export default useHistoryList;
