import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import Language from "../../../atoms/Language";

const useEditPress = () => {
  const language = useRecoilValue(Language);
  const queryClient = useQueryClient();

  const editPress = async ({ id, edit }) => {
    edit.language = language === "ENG" ? "ENGLISH" : "KOREAN";
    const { data } = await axios.put(`/admin/press-release/${id}`, edit, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  };

  const { mutate, data, isSuccess, isError, isLoading } = useMutation(
    editPress,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("pressList");
        console.log("success:", data);
      },
    }
  );

  return { mutate, data, isSuccess, isError, isLoading };
};

export default useEditPress;
