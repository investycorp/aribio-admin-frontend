import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useEditPublication = () => {
	const lan = "ENGLISH";
	const queryClient = useQueryClient();

	const editPublication = async ({ id, edit }) => {
		edit.language = lan;
		console.log(edit);
		const { data } = await axios.put(`/admin/publication/${id}`, edit, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		editPublication,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("publicationList");
				console.log("success:", data);
			},
		}
	);

	return { mutate, data, isSuccess, isError, isLoading };
};

export default useEditPublication;
