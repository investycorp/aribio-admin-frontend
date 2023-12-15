import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useDeletePopup = () => {
	const queryClient = useQueryClient();

	const deletePopup = async (id) => {
		const { data } = await axios.delete(`/admin/main/pop-up/${id}`);
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		deletePopup,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("popupList");
				console.log("success:", data);
			},
		}
	);

	return { mutate, data, isSuccess, isError, isLoading };
};

export default useDeletePopup;
