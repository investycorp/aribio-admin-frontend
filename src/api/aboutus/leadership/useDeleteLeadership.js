import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useDeleteLeadership = () => {
    const queryClient = useQueryClient();

    const deleteLeadership = async (id) => {
		const { data } = await axios.delete(`/admin/about-us/${id}`);
        return data;
    };

    const { mutate, data, isSuccess, isError, isLoading } = useMutation(
        deleteLeadership,
        {
            onSuccess: () => {
                queryClient.invalidateQueries("leadershipList");
                console.log("success:", data);
            },
        }
    );

    return { mutate, data, isSuccess, isError, isLoading };
};

export default useDeleteLeadership;
