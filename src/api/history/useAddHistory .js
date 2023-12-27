import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import Language from "../../atoms/Language";

const useAddHistory = () => {
  const language = useRecoilValue(Language);
  const queryClient = useQueryClient();

  const postHistoryData = async (formData) => {
    formData.language = language === "ENG" ? "ENGLISH" : "KOREAN";
    const { data } = await axios.post(`/admin/history`, formData);
    return data;
  };

  const { mutate, data, isSuccess, isError, isLoading } = useMutation(
    postHistoryData,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("historyList");
        console.log("success:", data);
      },
    }
  );

  return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddHistory;
