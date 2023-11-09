import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const useCareerList = () => {
    const lan = "ENGLISH";
    const queryClient = useQueryClient();
    const { data } = useQuery(
        "careerList",
        () => axios.get(`/admin/career/join-us`, { params: { language: lan } }),
        {
            initialData: queryClient.getQueryData("careerList"),
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

export default useCareerList;
