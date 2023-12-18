import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useEditPopup = () => {
	const lan = "ENGLISH";
	const queryClient = useQueryClient();

	const editPopup = async ({ id, edit }) => {
		edit.language = lan;
		const { data } = await axios.put(`/admin/main/pop-up/${id}`, edit, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		editPopup,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("popupList");
				console.log("success:", data);
			},
		}
	);

	return { mutate, data, isSuccess, isError, isLoading };
};

export default useEditPopup;
