import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const usePipelineList = () => {
    const lan = "ENGLISH";
    const queryClient = useQueryClient();
    const { data } = useQuery(
        "pipelineList",
        () => axios.get(`/admin/pipeline`, { params: { language: lan } }),
        {
            initialData: queryClient.getQueryData("pipelineList"),
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

export default usePipelineList;
