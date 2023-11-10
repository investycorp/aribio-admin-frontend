import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useAddPress = () => {
	const lan = "ENGLISH";
	const queryClient = useQueryClient();

	const postPress = async (formData) => {
		formData.language = lan;
		console.log("formData", formData);
		const { data } = await axios.post(`/admin/press-release`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		postPress,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("pressList");
				console.log("success:", data);
			},
		}
	);

	return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddPress;
