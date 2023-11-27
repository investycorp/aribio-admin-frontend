import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import Language from "../../atoms/Language";
import { useRecoilState } from "recoil";

const useAddCi = () => {
    const [language, setLanguage] = useRecoilState(Language);
    const lan = language === "ENG" ? "ENGLISH" : "KOREAN";
    const queryClient = useQueryClient();

    const postCiFile = async (formData) => {
        formData.language = lan;
        const { data } = await axios.post(`/admin/history`, formData);
        return data;
    };

    const { mutate, data, isSuccess, isError, isLoading } = useMutation(
        postCiFile,
        {
            onSuccess: () => {
                queryClient.invalidateQueries("historyList");
                console.log("success:", data);
            },
        }
    );

    return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddCi;
