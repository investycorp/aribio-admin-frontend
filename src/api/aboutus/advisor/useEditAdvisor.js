import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import Language from "../../../atoms/Language";

const useEditAdvisor = () => {
  const language = useRecoilValue(Language);
  const queryClient = useQueryClient();

  const editAdvisor = async ({ id, edit }) => {
    edit.language = language === "ENG" ? "ENGLISH" : "KOREAN";
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
