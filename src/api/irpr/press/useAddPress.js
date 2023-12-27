import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import Language from "../../../atoms/Language";

const useAddPress = () => {
  const language = useRecoilValue(Language);
  const queryClient = useQueryClient();

  const postPress = async (formData) => {
    formData.language = language === "ENG" ? "ENGLISH" : "KOREAN";
    console.log("formData", formData);
    const { data } = await axios.post(`/admin/press-release`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  };

  const { mutate, data, isSuccess, isError, isLoading } = useMutation(
    postPress,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("pressList");
        console.log("success:", data);
      },
    }
  );

  return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddPress;
