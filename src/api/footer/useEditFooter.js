import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import Language from "../../atoms/Language";
import { useRecoilState } from "recoil";

const useEditLink = () => {
    const [language, setLanguage] = useRecoilState(Language);
    const lan = language === "ENG" ? "ENGLISH" : "KOREAN";
    const queryClient = useQueryClient();

    const updateLink = async ({ id, edit }) => {
        edit.language = lan;
        console.log(edit);
        const { data } = await axios.put(
            `/admin/company-information/${id}`,
            edit,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return data;
    };

    const { mutate, data, isSuccess, isError, isLoading } = useMutation(
        updateLink,
        {
            onSuccess: () => {
                queryClient.invalidateQueries("footerList");
                console.log("success:", data);
            },
        }
    );

    return { mutate, data, isSuccess, isError, isLoading };
};

export default useEditLink;
