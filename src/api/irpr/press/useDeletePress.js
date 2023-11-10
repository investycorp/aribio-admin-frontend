import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useDeletePress = () => {
	const queryClient = useQueryClient();

	const deletePressData = async (id) => {
		const { data } = await axios.delete(`/admin/press-release/${id}`);
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		deletePressData,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("pressList");
				console.log("success:", data);
			},
		}
	);

	return { mutate, data, isSuccess, isError, isLoading };
};

export default useDeletePress;
