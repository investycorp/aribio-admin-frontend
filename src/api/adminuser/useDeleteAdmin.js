import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useDeleteAdmin = () => {
    const queryClient = useQueryClient();

    const deleteAdminData = async (id) => {
        const { data } = await axios.delete(`/super/${id}`);
        return data;
    };

    const { mutate, data, isSuccess, isError, isLoading } = useMutation(
        deleteAdminData,
        {
            onSuccess: () => {
                queryClient.invalidateQueries("deleteAdmin");
                console.log("success:", data);
            },
        }
    );

    return { mutate, data, isSuccess, isError, isLoading };
};

export default useDeleteAdmin;
