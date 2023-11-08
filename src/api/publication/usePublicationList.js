import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const usePublicationList = () => {
	const lan = "ENGLISH";
	const queryClient = useQueryClient();
	const { data } = useQuery(
		"publicationList",
		() => axios.get(`/admin/publication`, { params: { language: lan } }),
		{
			initialData: queryClient.getQueryData("publicationList"),
		}
	);

	return { data };
};

export default usePublicationList;
