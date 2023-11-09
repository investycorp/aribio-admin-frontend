import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useDeletePartner = () => {
    const queryClient = useQueryClient();

    const deletePartnerData = async (id) => {
        const { data } = await axios.delete(`/admin/partner/${id}`);
        return data;
    };

    const { mutate, data, isSuccess, isError, isLoading } = useMutation(
        deletePartnerData,
        {
            onSuccess: () => {
                queryClient.invalidateQueries("partnerList");
                console.log("success:", data);
            },
        }
    );

    return { mutate, data, isSuccess, isError, isLoading };
};

export default useDeletePartner;
