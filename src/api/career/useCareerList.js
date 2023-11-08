import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const useCareerList = () => {
	const lan = "ENGLISH";
	const queryClient = useQueryClient();
	const { data } = useQuery(
		"careerList",
		() => axios.get(`/admin/career/join-us`, { params: { language: lan } }),
		{
			initialData: queryClient.getQueryData("careerList"),
		}
	);

	return { data };
};

export default useCareerList;
