import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useAddMedia = () => {
    const lan = "ENGLISH";
    const queryClient = useQueryClient();

    const postMedia = async (formData) => {
        formData.language = lan;
        console.log("formData", formData);
        const { data } = await axios.post(`/admin/media-kit`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    };

    const { mutate, data, isSuccess, isError, isLoading } = useMutation(
        postMedia,
        {
            onSuccess: () => {
                queryClient.invalidateQueries("mediaList");
                console.log("success:", data);
            },
        }
    );

    return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddMedia;
