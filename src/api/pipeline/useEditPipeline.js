import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import Language from "../../atoms/Language";

const useEditPipeline = () => {
  const language = useRecoilValue(Language);
  const queryClient = useQueryClient();

  const editPipeline = async ({ id, edit }) => {
    edit.language = language === "ENG" ? "ENGLISH" : "KOREAN";
    const { data } = await axios.put(`/admin/pipeline/${id}`, edit);
    return data;
  };

  const { mutate, data, isSuccess, isError, isLoading } = useMutation(
    editPipeline,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("pipelineList");
      },
    }
  );

  return { mutate, data, isSuccess, isError, isLoading };
};

export default useEditPipeline;
