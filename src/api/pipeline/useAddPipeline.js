import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import Language from "../../atoms/Language";

const useAddPipeline = () => {
  const language = useRecoilValue(Language);
  const queryClient = useQueryClient();

  const postPipeline = async (formData) => {
    formData.language = language === "ENG" ? "ENGLISH" : "KOREAN";
    console.log("formData", formData);
    const { data } = await axios.post(`/admin/pipeline`, formData);
    return data;
  };

  const { mutate, data, isSuccess, isError, isLoading } = useMutation(
    postPipeline,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("pipelineList");
        console.log("success:", data);
      },
    }
  );

  return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddPipeline;
