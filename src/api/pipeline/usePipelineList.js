import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { useRecoilState } from "recoil";
import Language from "../../atoms/Language";

const usePipelineList = () => {
    const [language, setLanguage] = useRecoilState(Language);
    const lan = language === "ENG" ? "ENGLISH" : "KOREAN";
    const queryClient = useQueryClient();
    const { data, refetch } = useQuery(
        "pipelineList",
        () => axios.get(`/admin/pipeline`, { params: { language: lan } }),
        {
            initialData: queryClient.getQueryData("pipelineList"),
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

export default usePipelineList;
