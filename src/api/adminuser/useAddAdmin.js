import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useAddAdmin = () => {
	const queryClient = useQueryClient();

	const postAdminData = async (formData) => {
		const { data } = await axios.post(`/super`, formData);
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		postAdminData,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("AdminUserList");
				console.log("success:", data);
			},
			onError: () => {
				window.alert("Duplicate ID found.");
			}
		}
	);

	return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddAdmin;
