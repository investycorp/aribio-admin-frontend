import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import Language from "../../atoms/Language";

const useEditPublication = () => {
  const language = useRecoilValue(Language);
  const queryClient = useQueryClient();

  const editPublication = async ({ id, edit }) => {
    edit.language = language === "ENG" ? "ENGLISH" : "KOREAN";
    console.log(edit);
    const { data } = await axios.put(`/admin/publication/${id}`, edit, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  };

  const { mutate, data, isSuccess, isError, isLoading } = useMutation(
    editPublication,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("publicationList");
        console.log("success:", data);
      },
    }
  );

  return { mutate, data, isSuccess, isError, isLoading };
};

export default useEditPublication;
