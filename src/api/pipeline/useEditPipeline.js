import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useEditPipeline = () => {
  const lan = "ENGLISH";
  const queryClient = useQueryClient();

  const editPipeline = async ({ id, edit }) => {
    edit.language = lan;
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
