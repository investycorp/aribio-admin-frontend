import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import Language from "../../atoms/Language";
import { useRecoilState } from "recoil";

const usePublicationList = () => {
    const [language, setLanguage] = useRecoilState(Language);
    const lan = language === "ENG" ? "ENGLISH" : "KOREAN";
    const queryClient = useQueryClient();
    const { data, refetch } = useQuery(
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
            retry: 1,
        }
    );

    return { data, refetch };
};

export default usePublicationList;
