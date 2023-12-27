import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import Language from "../../../atoms/Language";

const useAddLeadership = () => {
  const language = useRecoilValue(Language);
  const queryClient = useQueryClient();

  const postLeadership = async (formData) => {
    formData.language = language === "ENG" ? "ENGLISH" : "KOREAN";
    const { data } = await axios.post(`/admin/about-us/leadership`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  };

  const { mutate, data, isSuccess, isError, isLoading } = useMutation(
    postLeadership,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("leadershipList");
      },
      onError: (error) => {
        window.alert("Only one representative CEO information is allowed.");
      },
    }
  );

  return { mutate, data, isSuccess, isError, isLoading };
};

export default useAddLeadership;
