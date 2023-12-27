import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import Language from "../../../atoms/Language";

const useAddMedia = () => {
  const language = useRecoilValue(Language);
  const queryClient = useQueryClient();

  const postMedia = async (formData) => {
    formData.language = language === "ENG" ? "ENGLISH" : "KOREAN";
    console.log("formData", formData);
    const { data } = await axios.post(`/admin/media-kit`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  };

  const { mutate, data, isSuccess, isError, isLoading } = useMutation(
    postMedia,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("mediaList");
      },
      onError: (error) => {
        window.alert("Only one representative video can be set.");
      },
    }
  );

  return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddMedia;
