import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useEditAdmin = () => {
	const queryClient = useQueryClient();

	const editAdminData = async ({ id, edit }) => {
		console.log("editAdminData: ", id, edit);
		const { data } = await axios.put(`/super/${id}`, edit, {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Credentials": true,
			},
		});
		console.log("edit return: ", data);
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		editAdminData,
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

export default useEditAdmin;
