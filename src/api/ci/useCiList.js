import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const useCiList = () => {
    const lan = "ENGLISH";
    const queryClient = useQueryClient();
    const { data } = useQuery(
        "ciList",
        () => axios.get(`/admin/ci`, { params: { language: lan } }),
        {
            initialData: queryClient.getQueryData("ciList"),
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

export default useCiList;
