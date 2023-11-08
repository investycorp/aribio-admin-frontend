import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useAddPipeline = () => {
	const lan = "ENGLISH";
	const queryClient = useQueryClient();

	const postPipeline = async (formData) => {
		formData.language = lan;
		console.log("formData", formData);
		const { data } = await axios.post(`/admin/pipeline`, formData);
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		postPipeline,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("pipelineList");
				console.log("success:", data);
			},
		}
	);

	return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddPipeline;
