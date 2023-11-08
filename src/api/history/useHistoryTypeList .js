import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const useHistoryTypeList = () => {
	const lan = "ENGLISH";
	const queryClient = useQueryClient();
	const { data } = useQuery(
		"historyTypeList",
		() => axios.get(`/admin/history/type`, { params: { language: lan } }),
		{
			initialData: queryClient.getQueryData("historyTypeList"),
		}
	);

	return { data };
};

export default useHistoryTypeList;
