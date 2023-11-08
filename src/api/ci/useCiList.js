import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const useCiList = () => {
	const lan = "ENGLISH";
	const queryClient = useQueryClient();
	const { data } = useQuery(
		"ciList",
		() => axios.get(`/admin/ci`, { params: { language: lan } }),
		{
			initialData: queryClient.getQueryData("ciList"),
		}
	);

	return { data };
};

export default useCiList;
