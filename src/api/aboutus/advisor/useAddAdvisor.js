import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import Language from "../../../atoms/Language";

const useAddAdvisor = () => {
  const language = useRecoilValue(Language);
  const queryClient = useQueryClient();

  const postNotice = async (formData) => {
    formData.language = language === "ENG" ? "ENGLISH" : "KOREAN";
    const { data } = await axios.post(`/admin/about-us/advisor`, formData);
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
