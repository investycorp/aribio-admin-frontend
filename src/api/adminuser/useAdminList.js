import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const useAdminList = () => {
    const queryClient = useQueryClient();
    const { data, isLoading, refetch } = useQuery(
        "AdminUserList",
        () => axios.get(`/super`),
        {
            initialData: queryClient.getQueryData("AdminUserList"),
            onError: (error) => {
                console.log("error", error?.message);
                window.localStorage.removeItem("token");
                window.localStorage.removeItem("role");
                window.location.href = "/login";
            },
        }
    );
    return { data, isLoading, refetch };
};

export default useAdminList;
