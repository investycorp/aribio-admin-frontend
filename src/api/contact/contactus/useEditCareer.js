import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import Language from "../../../atoms/Language";

const useEditCareer = () => {
  const language = useRecoilValue(Language);
  const queryClient = useQueryClient();

  const editCareer = async ({ id, edit }) => {
    edit.language = language === "ENG" ? "ENGLISH" : "KOREAN";
    const { data } = await axios.put(`/admin/career/join-us/${id}`, edit, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  };

  const { mutate, data, isSuccess, isError, isLoading } = useMutation(
    editCareer,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("careerList");
        console.log("success:", data);
      },
    }
  );

  return { mutate, data, isSuccess, isError, isLoading };
};

export default useEditCareer;
