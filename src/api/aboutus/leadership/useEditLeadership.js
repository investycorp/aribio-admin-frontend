import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import Language from "../../../atoms/Language";

const useEditLeadership = () => {
  const language = useRecoilValue(Language);
  const queryClient = useQueryClient();

  const editLeadership = async ({ id, edit }) => {
    edit.language = language === "ENG" ? "ENGLISH" : "KOREAN";
    const { data } = await axios.put(`/admin/about-us/leadership/${id}`, edit, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  };

  const { mutate, data, isSuccess, isError, isLoading } = useMutation(
    editLeadership,
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

export default useEditLeadership;
