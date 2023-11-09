import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useEditPartner = () => {
    const lan = "ENGLISH";
    const queryClient = useQueryClient();

    const editPartner = async ({ id, edit }) => {
        edit.language = lan;
        const { data } = await axios.put(`/admin/partner/${id}`, edit, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    };

    const { mutate, data, isSuccess, isError, isLoading } = useMutation(
        editPartner,
        {
            onSuccess: () => {
                queryClient.invalidateQueries("partnerList");
                console.log("success:", data);
            },
        }
    );

    return { mutate, data, isSuccess, isError, isLoading };
};

export default useEditPartner;
