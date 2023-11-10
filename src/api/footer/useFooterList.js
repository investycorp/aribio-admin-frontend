import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const useFooterList = () => {
	const lan = "ENGLISH";
	const queryClient = useQueryClient();
	const { data } = useQuery(
		"footerList",
		() =>
			axios.get(`/admin/company-information`, { params: { language: lan } }),
		{
			initialData: queryClient.getQueryData("footerList"),
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

export default useFooterList;
