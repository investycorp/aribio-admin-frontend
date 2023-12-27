import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import Language from "../../../atoms/Language";

const useAddPartner = () => {
  const language = useRecoilValue(Language);
  const queryClient = useQueryClient();

  const postPartner = async (formData) => {
    formData.language = language === "ENG" ? "ENGLISH" : "KOREAN";
    console.log("formData", formData);
    const { data } = await axios.post(`/admin/partner`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  };

  const { mutate, data, isSuccess, isError, isLoading } = useMutation(
    postPartner,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("partnerList");
        console.log("success:", data);
      },
    }
  );

  return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddPartner;
