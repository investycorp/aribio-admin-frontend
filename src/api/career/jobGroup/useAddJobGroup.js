import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import Language from "../../../atoms/Language";

const useAddJobGroup = () => {
  const language = useRecoilValue(Language);
  const queryClient = useQueryClient();

  const postCareer = async (formData) => {
    formData.language = language === "ENG" ? "ENGLISH" : "KOREAN";
    console.log("formData", formData);
    const { data } = await axios.post(`/admin/career/job-group`, formData);
    return data;
  };

  const { mutate, data, isSuccess, isError, isLoading } = useMutation(
    postCareer,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("jobGroupList");
      },
      onError: () => {
        alert("Duplicate value exists");
      },
    }
  );

  return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddJobGroup;
