import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const useJobGroupList = () => {
    const lan = "ENGLISH";
    const queryClient = useQueryClient();
    const { data } = useQuery(
        "jobGroupList",
        () =>
            axios.get(`/admin/career/job-group`, {
                params: { language: lan },
            }),
        {
            initialData: queryClient.getQueryData("jobGroupList"),
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

export default useJobGroupList;
