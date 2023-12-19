import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import Language from "../../../atoms/Language";
import { useRecoilState } from "recoil";

const useEditLeadership = () => {
	const [language, setLanguage] = useRecoilState(Language);
	const lan = language === "ENG" ? "ENGLISH" : "KOREAN";
    const queryClient = useQueryClient();

    const editLeadership = async ({ id, edit }) => {
        edit.language = lan;
        console.log(edit, "edit")
        const { data } = await axios.put(`/admin/about-us/leadership/${id}`, edit, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    };

    const { mutate, data, isSuccess, isError, isLoading } = useMutation(
        editLeadership,
        {
            onSuccess: () => {
                queryClient.invalidateQueries("leadershipList");
            },
            onError: error => {
                window.alert("Only one representative CEO information is allowed.");
            }
        }
    );

    return { mutate, data, isSuccess, isError, isLoading };
};

export default useEditLeadership;
