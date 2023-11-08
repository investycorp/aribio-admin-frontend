import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useDeletePublication = () => {
	const queryClient = useQueryClient();

	const deletePublicationData = async (id) => {
		const { data } = await axios.delete(`/admin/publication/${id}`);
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		deletePublicationData,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("publicationList");
				console.log("success:", data);
			},
		}
	);

	return { mutate, data, isSuccess, isError, isLoading };
};

export default useDeletePublication;
