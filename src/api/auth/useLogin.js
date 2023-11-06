import axios from "axios";
import { useMutation } from "react-query";

const login = async (variable) => {
    const { data } = await axios.post("/admin/login/sign-in", variable);
    console.log("Login Data: ", data);
    return data;
};

const useLogin = () => useMutation(login);

export default useLogin;
