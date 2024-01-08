import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import Language from "../../atoms/Language";

const useAddHistoryType = () => {
  const language = useRecoilValue(Language);
  const queryClient = useQueryClient();

  const postHistoryTypeData = async (formData) => {
    formData.language = language === "ENG" ? "ENGLISH" : "KOREAN";
    const { data } = await axios.post(`/admin/history/type`, formData);
    return data;
  };

  const { mutate, data, isSuccess, isError, isLoading } = useMutation(
    postHistoryTypeData,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("historyTypeList");
        console.log("success:", data);
      },
    }
  );

  return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddHistoryType;
