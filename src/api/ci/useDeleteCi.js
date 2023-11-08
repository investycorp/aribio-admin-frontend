import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useDeleteHistory = () => {
	const queryClient = useQueryClient();

	const deleteHistoryData = async (id) => {
		const { data } = await axios.delete(`/admin/history/${id}`);
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		deleteHistoryData,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("historyList");
				console.log("success:", data);
			},
		}
	);

	return { mutate, data, isSuccess, isError, isLoading };
};

export default useDeleteHistory;
