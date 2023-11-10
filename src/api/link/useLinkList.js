import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const useLinkList = () => {
	const lan = "ENGLISH";
	const queryClient = useQueryClient();
	const { data } = useQuery(
		"linkList",
		() => axios.get(`/admin/memo-re`, { params: { language: lan } }),
		{
			initialData: queryClient.getQueryData("linkList"),
			onError: (error) => {
				console.log("error", error?.data.response?.message);
				window.localStorage.removeItem("token");
				window.localStorage.removeItem("role");
				window.location.href = "/login";
			},
		}
	);

	return { data };
};

export default useLinkList;
