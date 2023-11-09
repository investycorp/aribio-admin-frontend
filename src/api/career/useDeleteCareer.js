import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useDeleteCareer = () => {
    const queryClient = useQueryClient();

    const deleteCareerData = async (id) => {
        const { data } = await axios.delete(`/admin/career/join-us/${id}`);
        return data;
    };

    const { mutate, data, isSuccess, isError, isLoading } = useMutation(
        deleteCareerData,
        {
            onSuccess: () => {
                queryClient.invalidateQueries("careerList");
                console.log("success:", data);
            },
        }
    );

    return { mutate, data, isSuccess, isError, isLoading };
};

export default useDeleteCareer;
