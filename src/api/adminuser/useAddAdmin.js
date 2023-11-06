import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useAddAdmin = () => {
    const queryClient = useQueryClient();

    const postAdminData = async (formData) => {
        const { data } = await axios.post(`/super`, formData);
        return data;
    };

    const { mutate, data, isSuccess, isError, isLoading } = useMutation(
        postAdminData,
        {
            onSuccess: () => {
                queryClient.invalidateQueries("addAdmin");
                console.log("success:", data);
            },
        }
    );

    return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddAdmin;
