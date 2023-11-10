import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const usePressList = () => {
	const lan = "ENGLISH";
	const queryClient = useQueryClient();
	const { data } = useQuery(
		"pressList",
		() => axios.get(`/admin/press-release/all`, { params: { language: lan } }),
		{
			initialData: queryClient.getQueryData("pressList"),
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

export default usePressList;
