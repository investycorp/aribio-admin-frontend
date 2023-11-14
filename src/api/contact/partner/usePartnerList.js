import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import Language from "../../../atoms/Language";
import { useRecoilState } from "recoil";

const usePartnerList = () => {
    const [language, setLanguage] = useRecoilState(Language);
    const lan = language === "ENG" ? "ENGLISH" : "KOREAN";
    const queryClient = useQueryClient();
    const { data, refetch } = useQuery(
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
            retry: 1,
        }
    );

    return { data, refetch };
};

export default usePartnerList;
