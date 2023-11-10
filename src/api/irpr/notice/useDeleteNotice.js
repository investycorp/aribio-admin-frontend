import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useDeleteNotice = () => {
	const queryClient = useQueryClient();

	const deleteNoticeData = async (id) => {
		const { data } = await axios.delete(`/admin/notice/${id}`);
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		deleteNoticeData,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("noticeList");
				console.log("success:", data);
			},
		}
	);

	return { mutate, data, isSuccess, isError, isLoading };
};

export default useDeleteNotice;
