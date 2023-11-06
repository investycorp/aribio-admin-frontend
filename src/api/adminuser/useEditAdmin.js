import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useEditAdmin = () => {
    const queryClient = useQueryClient();

    const editAdminData = async (id, formData) => {
        const { data } = await axios.delete(`/super/${id}`, formData);
        return data;
    };

    const { mutate, data, isSuccess, isError, isLoading } = useMutation(
        editAdminData,
        {
            onSuccess: () => {
                queryClient.invalidateQueries("editAdmin");
                console.log("success:", data);
            },
        }
    );

    return { mutate, data, isSuccess, isError, isLoading };
};

export default useEditAdmin;

//CHECK!!!!
