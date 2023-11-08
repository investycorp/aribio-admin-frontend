import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useAddHistoryType = () => {
	const lan = "ENGLISH";
	const queryClient = useQueryClient();

	const postHistoryTypeData = async (formData) => {
		formData.language = lan;
		const { data } = await axios.post(`/admin/history/type`, formData);
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		postHistoryTypeData,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("historyTypeList");
				console.log("success:", data);
			},
		}
	);

	return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddHistoryType;
