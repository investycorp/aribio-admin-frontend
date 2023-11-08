import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const usePipelineList = () => {
	const lan = "ENGLISH";
	const queryClient = useQueryClient();
	const { data } = useQuery(
		"pipelineList",
		() => axios.get(`/admin/pipeline`, { params: { language: lan } }),
		{
			initialData: queryClient.getQueryData("pipelineList"),
		}
	);

	return { data };
};

export default usePipelineList;
