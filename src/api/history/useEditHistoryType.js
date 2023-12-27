import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import Language from "../../atoms/Language";

const useEditHistoryType = () => {
  const language = useRecoilValue(Language);
  const queryClient = useQueryClient();

  const editHistoryTypeData = async ({ id, edit }) => {
    edit.language = language === "ENG" ? "ENGLISH" : "KOREAN";
    const { data } = await axios.put(`/admin/history/type/${id}`, edit);
    return data;
  };

  const { mutate, data, isSuccess, isError, isLoading } = useMutation(
    editHistoryTypeData,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("historyTypeList");
        queryClient.invalidateQueries("historyList");
        console.log("success:", data);
      },
    }
  );

  return { mutate, data, isSuccess, isError, isLoading };
};

export default useEditHistoryType;
