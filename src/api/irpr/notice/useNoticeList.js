import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const useNoticeList = () => {
	const lan = "ENGLISH";
	const queryClient = useQueryClient();
	const { data } = useQuery(
		"noticeList",
		() => axios.get(`/admin/notice/all`, { params: { language: lan } }),
		{
			initialData: queryClient.getQueryData("noticeList"),
			onError: (error) => {
				console.log("error", error?.message);
				window.localStorage.removeItem("token");
				window.localStorage.removeItem("role");
				window.location.href = "/login";
			},
		}
	);

	return { data };
};

export default useNoticeList;
