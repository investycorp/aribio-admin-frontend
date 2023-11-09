import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const useContactList = () => {
    const lan = "ENGLISH";
    const queryClient = useQueryClient();
    const { data } = useQuery(
        "contactList",
        () =>
            axios.get(`/admin/contact-us`, {
                params: { language: lan },
            }),
        {
            initialData: queryClient.getQueryData("contactList"),
            onError: (error) => {
                // console.log("error", error?.message);
                // window.localStorage.removeItem("token");
                // window.localStorage.removeItem("role");
                // window.location.href = "/";
            },
        }
    );

    return { data };
};

export default useContactList;
