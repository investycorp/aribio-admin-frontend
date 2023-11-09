import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const usePartnerList = () => {
    const lan = "ENGLISH";
    const queryClient = useQueryClient();
    const { data } = useQuery(
        "partnerList",
        () => axios.get(`/admin/partner`, { params: { language: lan } }),
        {
            initialData: queryClient.getQueryData("partnerList"),
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

export default usePartnerList;
