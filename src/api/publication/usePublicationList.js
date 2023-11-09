import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const usePublicationList = () => {
    const lan = "ENGLISH";
    const queryClient = useQueryClient();
    const { data } = useQuery(
        "publicationList",
        () => axios.get(`/admin/publication`, { params: { language: lan } }),
        {
            initialData: queryClient.getQueryData("publicationList"),
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

export default usePublicationList;
