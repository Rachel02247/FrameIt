/* eslint-disable react-refresh/only-export-components */
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../global-states/userSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../global-states/store";

export default  () => {

    const dispatch = useDispatch<AppDispatch>();

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        if (credentialResponse.credential) {
           dispatch(googleLogin(credentialResponse.credential));
        }
      }}
      onError={() => {
        console.error("Google Login Failed");
      }}
      shape="rectangular"
      size="large"
      width="100%"
    />
  );
};


