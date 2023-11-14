import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import Language from "../../../atoms/Language";
import { useRecoilState } from "recoil";

const useContactList = () => {
    const [language, setLanguage] = useRecoilState(Language);
    const lan = language === "ENG" ? "ENGLISH" : "KOREAN";
    const queryClient = useQueryClient();
    const { data, refetch } = useQuery(
        "contactList",
        () =>
            axios.get(`/admin/contact-us`, {
                params: { language: lan },
            }),
        {
            initialData: queryClient.getQueryData("contactList"),
            onError: (error) => {
                console.log("error", error?.message);
                window.localStorage.removeItem("token");
                window.localStorage.removeItem("role");
                window.location.href = "/login";
            },
            retry: 1,
        }
    );

    return { data, refetch };
};

export default useContactList;
