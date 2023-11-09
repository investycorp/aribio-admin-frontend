import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const useHistoryTypeList = () => {
    const lan = "ENGLISH";
    const queryClient = useQueryClient();
    const { data } = useQuery(
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
        }
    );

    return { data };
};

export default useHistoryTypeList;
