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
        if (
          location.pathname.includes("admin") &&
          error?.response?.status !== 403
        ) {
          window.alert("Error occurred. Please reload or try again later.");
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("role");
          window.location.href = "/login";
        } else if (error?.response?.status === 403) {
          window.alert("You are not authorized to access this page.");
          window.location.href = "/history";
        }
      },
      retry: 0,
    }
  );
  return { data, isLoading, refetch };
};

export default useAdminList;
