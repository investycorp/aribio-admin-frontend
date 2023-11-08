import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useAddHistory = () => {
	const lan = "ENGLISH";
	const queryClient = useQueryClient();

	const postHistoryData = async (formData) => {
		formData.language = lan;
		const { data } = await axios.post(`/admin/history`, formData);
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		postHistoryData,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("historyList");
				console.log("success:", data);
			},
		}
	);

	return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddHistory;
