import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { useLocation } from "react-router-dom";

const useAdminList = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery(
    "AdminUserList",
    () => axios.get(`/super`),
    {
      initialData: queryClient.getQueryData("AdminUserList"),
      onError: (error) => {
        console.log("error", error?.message);
        if (location.pathname.includes("admin")) {
          window.alert("Error occurred. Please reload or try again later.");
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("role");
          window.location.href = "/login";
        }
      },
      retry: 1,
    }
  );
  return { data, isLoading, refetch };
};

export default useAdminList;
