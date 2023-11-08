import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const useHistoryList = () => {
	const lan = "ENGLISH";
	const queryClient = useQueryClient();
	const { data } = useQuery(
		"historyList",
		() => axios.get(`/admin/history`, { params: { language: lan } }),
		{
			initialData: queryClient.getQueryData("historyList"),
		}
	);
	// console.log("History data: ", data);

	return { data };
};

export default useHistoryList;
