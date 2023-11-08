import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useAddPublication = () => {
	const lan = "ENGLISH";
	const queryClient = useQueryClient();

	const postPublication = async (formData) => {
		formData.language = lan;
		console.log("formData", formData);
		const { data } = await axios.post(`/admin/publication`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		postPublication,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("publicationList");
				console.log("success:", data);
			},
		}
	);

	return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddPublication;
