import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const useMediaList = () => {
    const lan = "ENGLISH";
    const queryClient = useQueryClient();
    const { data } = useQuery(
        "mediaList",
        () => axios.get(`/admin/media-kit`, { params: { language: lan } }),
        {
            initialData: queryClient.getQueryData("mediaList"),
            // onError: (error) => {
            //     console.log("error", error?.message);
            //     window.localStorage.removeItem("token");
            //     window.localStorage.removeItem("role");
            //     window.location.href = "/login";
            // },
        }
    );

    return { data };
};

export default useMediaList;
