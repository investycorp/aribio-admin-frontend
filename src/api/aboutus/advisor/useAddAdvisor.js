import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilState, useRecoilValue } from "recoil";
import Language from "../../../atoms/Language";

const useAddAdvisor = () => {
	const [language, setLanguage] = useRecoilState(Language);
	const lan = language === "ENG" ? "ENGLISH" : "KOREAN";
	const queryClient = useQueryClient();

	const postNotice = async (formData) => {
		formData.language = lan;
		const { data } = await axios.post(`/admin/about-us/advisor`, formData, );
		return data;
	};

	const { mutate, data, isSuccess, isError, isLoading } = useMutation(
		postNotice,
		{
			onSuccess: () => {
				queryClient.invalidateQueries("advisorList");
				console.log("success:", data);
			},
		}
	);

	return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddAdvisor;
