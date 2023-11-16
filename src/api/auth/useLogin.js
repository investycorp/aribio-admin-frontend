import axios from "axios";
import { useMutation } from "react-query";

const login = async (variable) => {
  try {
    const { data } = await axios.post("/admin/login/sign-in", variable);
    return data;
  } catch (error) {
    window.alert(error?.response?.data?.message);
    // window.localStorage.removeItem("token");
    // window.localStorage.removeItem("role");
    // window.location.reload();
  }
};

const useLogin = () => useMutation(login);

export default useLogin;
