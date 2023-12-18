import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useEditHistoryType = () => {
	const lan = "ENGLISH";
	const queryClient = useQueryClient();

	const editHistoryTypeData = async ({ id, edit }) => {
		edit.language = lan;
		const { data } = await axios.put(`/admin/history/type/${id}`, edit);
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		editHistoryTypeData,
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

export default useEditHistoryType;
