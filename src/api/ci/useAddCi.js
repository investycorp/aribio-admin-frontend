import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import Language from "../../atoms/Language";
import { useRecoilValue } from "recoil";

const useAddCi = () => {
  const language = useRecoilValue(Language);
  const queryClient = useQueryClient();

  const postCiFile = async (formData) => {
    formData.language = language === "ENG" ? "ENGLISH" : "KOREAN";
    const { data } = await axios.post(`/admin/history`, formData);
    return data;
  };

  const { mutate, data, isSuccess, isError, isLoading } = useMutation(
    postCiFile,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("historyList");
        console.log("success:", data);
      },
    }
  );

  return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddCi;
