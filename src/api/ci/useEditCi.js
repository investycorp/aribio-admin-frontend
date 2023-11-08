import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useEditHistory = () => {
	const lan = "ENGLISH";
	const queryClient = useQueryClient();

	const editHistoryData = async ({ id, edit }) => {
		edit.language = lan;
		const { data } = await axios.put(`/admin/history/${id}`, edit);
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		editHistoryData,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("historyList");
				console.log("success:", data);
			},
		}
	);

	return { mutate, data, isSuccess, isError, isLoading };
};

export default useEditHistory;
