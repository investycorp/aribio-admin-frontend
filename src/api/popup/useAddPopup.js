import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useAddPopup = () => {
	const lan = "ENGLISH";
	const queryClient = useQueryClient();

	const postPopup = async (formData) => {
		formData.language = lan;
		console.log("formData", formData);
		const { data } = await axios.post(`/admin/main/pop-up`, formData);
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		postPopup,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("popupList");
				console.log("success:", data);
			},
		}
	);

	return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddPopup;
