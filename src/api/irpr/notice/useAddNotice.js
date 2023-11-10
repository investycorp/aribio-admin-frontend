import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useAddNotice = () => {
	const lan = "ENGLISH";
	const queryClient = useQueryClient();

	const postNotice = async (formData) => {
		formData.language = lan;
		console.log("formData", formData);
		const { data } = await axios.post(`/admin/notice`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		postNotice,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("noticeList");
				console.log("success:", data);
			},
		}
	);

	return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddNotice;
