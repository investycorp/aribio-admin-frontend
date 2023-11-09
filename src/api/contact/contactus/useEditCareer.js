import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useEditCareer = () => {
    const lan = "ENGLISH";
    const queryClient = useQueryClient();

    const editCareer = async ({ id, edit }) => {
        edit.language = lan;
        const { data } = await axios.put(`/admin/career/join-us/${id}`, edit, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    };

    const { mutate, data, isSuccess, isError, isLoading } = useMutation(
        editCareer,
        {
            onSuccess: () => {
                queryClient.invalidateQueries("careerList");
                console.log("success:", data);
            },
        }
    );

    return { mutate, data, isSuccess, isError, isLoading };
};

export default useEditCareer;
