import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useDeleteAdvisor = () => {
	const queryClient = useQueryClient();

	const deleteAdvisorData = async (id) => {
		const { data } = await axios.delete(`/admin/about-us/${id}`);
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		deleteAdvisorData,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("advisorList");
				console.log("success:", data);
			},
		}
	);

	return { mutate, data, isSuccess, isError, isLoading };
};

export default useDeleteAdvisor;
