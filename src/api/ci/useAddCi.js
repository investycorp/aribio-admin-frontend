import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useAddCi = () => {
	const lan = "ENGLISH";
	const queryClient = useQueryClient();

	const postCiFile = async (formData) => {
		formData.language = lan;
		const { data } = await axios.post(`/admin/history`, formData);
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		postCiFile,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("historyList");
				console.log("success:", data);
			},
		}
	);

	return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddCi;
