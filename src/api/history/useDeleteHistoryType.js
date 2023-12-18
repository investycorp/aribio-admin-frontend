import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useDeleteHistoryType = () => {
	const queryClient = useQueryClient();

	const deleteHistoryTypeData = async (id) => {
		const { data } = await axios.delete(`/admin/history/type/${id}`);
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		deleteHistoryTypeData,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("historyTypeList");
				queryClient.invalidateQueries("historyList");
				console.log("success:", data);
			},
		}
	);

	return { mutate, data, isSuccess, isError, isLoading };
};

export default useDeleteHistoryType;
