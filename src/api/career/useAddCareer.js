import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useAddCareer = () => {
    const lan = "ENGLISH";
    const queryClient = useQueryClient();

    const postCareer = async (formData) => {
        formData.language = lan;
        console.log("formData", formData);
        const { data } = await axios.post(`/admin/career/join-us`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    };

    const { mutate, data, isSuccess, isError, isLoading } = useMutation(
        postCareer,
        {
            onSuccess: () => {
                queryClient.invalidateQueries("careerList");
                console.log("success:", data);
            },
        }
    );

    return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddCareer;
