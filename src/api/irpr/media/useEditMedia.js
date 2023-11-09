import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useEditMedia = () => {
    const lan = "ENGLISH";
    const queryClient = useQueryClient();

    const editMedia = async ({ id, edit }) => {
        edit.language = lan;
        console.log(edit);
        const { data } = await axios.put(`/admin/media-kit/${id}`, edit, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    };

    const { mutate, data, isSuccess, isError, isLoading } = useMutation(
        editMedia,
        {
            onSuccess: () => {
                queryClient.invalidateQueries("mediaList");
                console.log("success:", data);
            },
        }
    );

    return { mutate, data, isSuccess, isError, isLoading };
};

export default useEditMedia;
