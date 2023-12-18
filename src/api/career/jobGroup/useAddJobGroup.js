import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useAddJobGroup = () => {
    const lan = "ENGLISH";
    const queryClient = useQueryClient();

    const postCareer = async (formData) => {
        formData.language = lan;
        console.log("formData", formData);
        const { data } = await axios.post(`/admin/career/job-group`, formData);
        return data;
    };

    const { mutate, data, isSuccess, isError, isLoading } = useMutation(
        postCareer,
        {
            onSuccess: () => {
                queryClient.invalidateQueries("jobGroupList");
                console.log("success:", data);
            },
            onError: () => {
                alert('Duplicate value exists');
            }
        }
    );

    return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddJobGroup;
