import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useDeletePipeline = () => {
	const queryClient = useQueryClient();

	const deletePipelineData = async (id) => {
		const { data } = await axios.delete(`/admin/pipeline/${id}`);
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		deletePipelineData,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("pipelineList");
				console.log("success:", data);
			},
		}
	);

	return { mutate, data, isSuccess, isError, isLoading };
};

export default useDeletePipeline;
