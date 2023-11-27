import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilState } from "recoil";
import Language from "../../atoms/Language";

const useEditCi = () => {
    const [language, setLanguage] = useRecoilState(Language);
    const lan = language === "ENG" ? "ENGLISH" : "KOREAN";
    const queryClient = useQueryClient();

    const editCiData = async ({ id, edit }) => {
        edit.language = lan;
        const { data } = await axios.put(`/admin/ci/${id}`, edit, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    };

    const { mutate, data, isSuccess, isError, isLoading } = useMutation(
        editCiData,
        {
            onSuccess: () => {
                queryClient.invalidateQueries("ciList");
                console.log("success:", data);
            },
        }
    );

    return { mutate, data, isSuccess, isError, isLoading };
};

export default useEditCi;
