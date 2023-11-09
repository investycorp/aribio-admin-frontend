import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useDeleteMedia = () => {
    const queryClient = useQueryClient();

    const deleteMediaData = async (id) => {
        const { data } = await axios.delete(`/admin/media-kit/${id}`);
        return data;
    };

    const { mutate, data, isSuccess, isError, isLoading } = useMutation(
        deleteMediaData,
        {
            onSuccess: () => {
                queryClient.invalidateQueries("mediaList");
                console.log("success:", data);
            },
        }
    );

    return { mutate, data, isSuccess, isError, isLoading };
};

export default useDeleteMedia;
