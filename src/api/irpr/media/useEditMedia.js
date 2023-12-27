import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import Language from "../../../atoms/Language";

const useEditMedia = () => {
  const language = useRecoilValue(Language);
  const queryClient = useQueryClient();

  const editMedia = async ({ id, edit }) => {
    edit.language = language === "ENG" ? "ENGLISH" : "KOREAN";
    const { data } = await axios.put(`/admin/media-kit/${id}`, edit, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  };

  const { mutate, data, isSuccess, isError, isLoading } = useMutation(
    editMedia,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("mediaList");
      },
      onError: (error) => {
        console.log(error);
        window.alert("Only one representative video can be set.");
      },
    }
  );

  return { mutate, data, isSuccess, isError, isLoading };
};

export default useEditMedia;
