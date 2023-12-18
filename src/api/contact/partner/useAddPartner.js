import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useAddPartner = () => {
    const lan = "ENGLISH";
    const queryClient = useQueryClient();

    const postPartner = async (formData) => {
        formData.language = lan;
        console.log("formData", formData);
        const { data } = await axios.post(`/admin/partner`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    };

    const { mutate, data, isSuccess, isError, isLoading } = useMutation(
        postPartner,
        {
            onSuccess: () => {
                queryClient.invalidateQueries("partnerList");
                console.log("success:", data);
            },
        }
    );

    return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddPartner;
