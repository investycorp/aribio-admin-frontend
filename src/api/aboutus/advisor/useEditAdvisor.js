import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilState } from "recoil";
import Language from "../../../atoms/Language";

const useEditAdvisor = () => {
	const [language, setLanguage] = useRecoilState(Language);
	const lan = language === "ENG" ? "ENGLISH" : "KOREAN";
	const queryClient = useQueryClient();

	const editAdvisor = async ({ id, edit }) => {
		edit.language = lan;
		const { data } = await axios.put(`/admin/about-us/advisor/${id}`, edit);
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		editAdvisor,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("advisorList");
				console.log("success:", data);
			},
		}
	);

	return { mutate, data, isSuccess, isError, isLoading };
};

export default useEditAdvisor;
