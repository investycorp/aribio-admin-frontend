import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import Language from "../../../atoms/Language";

const useEditPartner = () => {
  const language = useRecoilValue(Language);
  const queryClient = useQueryClient();

  const editPartner = async ({ id, edit }) => {
    edit.language = language === "ENG" ? "ENGLISH" : "KOREAN";
    const { data } = await axios.put(`/admin/partner/${id}`, edit, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  };

  const { mutate, data, isSuccess, isError, isLoading } = useMutation(
    editPartner,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("partnerList");
        console.log("success:", data);
      },
    }
  );

  return { mutate, data, isSuccess, isError, isLoading };
};

export default useEditPartner;
