import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import Language from "../../atoms/Language";

const useAddPopup = () => {
  const language = useRecoilValue(Language);
  const queryClient = useQueryClient();

  const postPopup = async (formData) => {
    formData.language = language === "ENG" ? "ENGLISH" : "KOREAN";
    console.log("formData", formData);
    const { data } = await axios.post(`/admin/main/pop-up`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  };

  const { mutate, data, isSuccess, isError, isLoading } = useMutation(
    postPopup,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("popupList");
        console.log("success:", data);
      },
      onError: (error) => {
        console.log(error.response);
      },
    }
  );

  return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddPopup;
