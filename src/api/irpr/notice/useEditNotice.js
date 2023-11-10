import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useEditNotice = () => {
	const lan = "ENGLISH";
	const queryClient = useQueryClient();

	const editNotice = async ({ id, edit }) => {
		edit.language = lan;
		const { data } = await axios.put(`/admin/notice/${id}`, edit, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		editNotice,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("noticeList");
				console.log("success:", data);
			},
		}
	);

	return { mutate, data, isSuccess, isError, isLoading };
};

export default useEditNotice;
