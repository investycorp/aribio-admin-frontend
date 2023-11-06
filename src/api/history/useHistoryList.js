import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const useHistoryList = () => {
    const queryClient = useQueryClient();
    const { data } = useQuery(
        "historyList",
        () => axios.get(`/admin/history`),
        {
            initialData: queryClient.getQueryData("historyList"),
        }
    );
    console.log("History data: ", data);

    return { data };
};

export default useHistoryList;
