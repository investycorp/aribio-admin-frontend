import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import Language from "../../atoms/Language";
import { useRecoilValue } from "recoil";

const useEditLink = () => {
  const language = useRecoilValue(Language);
  const lan = language === "ENG" ? "ENGLISH" : "KOREAN";
  const queryClient = useQueryClient();

  const updateLink = async ({ editId, edit }) => {
    edit.language = lan;
    const { data } = await axios.put(`/admin/memo-re/${editId}`, edit);
    return data;
  };

  const { mutate, data, isSuccess, isError, isLoading } = useMutation(
    updateLink,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("linkList");
        console.log("success:", data);
      },
    }
  );

  return { mutate, data, isSuccess, isError, isLoading };
};

export default useEditLink;
