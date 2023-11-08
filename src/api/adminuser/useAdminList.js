import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const useAdminList = () => {
	const queryClient = useQueryClient();
	const { data, isLoading, refetch } = useQuery(
		"AdminUserList",
		() => axios.get(`/super`),
		{
			initialData: queryClient.getQueryData("AdminUserList"),
		}
	);
	return { data, isLoading, refetch };
};

export default useAdminList;
