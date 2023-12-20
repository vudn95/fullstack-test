import { TextField, Button } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import request from "../../../utils/request";
import { StyledContainer } from "./styles";
import { useAuth } from "../../../AuthContext";
import { useState } from "react";

const schema = yup.object().shape({
  email: yup.string().required("Email is required").email("Email invalid"),
  password: yup.string().required("Password is required"),
});

interface Inputs {
  email: string;
  password: string;
}

function Component() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const { setAccessToken, setUserData, setLoadingProfile } = useAuth();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    try {
      setLoading(true);
      request()
        .post("/auth/signin", data)
        .then((responseData) => {
          setLoadingProfile(true);
          setAccessToken(responseData?.data?.accessToken as string);
          request(
            {},
            { Authorization: `Bearer ${responseData?.data?.accessToken}` }
          )
            .get("/auth/my-profie")
            .then((responseDataUser) => {
              setUserData(responseDataUser.data);
              setLoadingProfile(false);
              navigate("/dashboard/profile");
            });
        });
    } catch (err: any) {
      setError("password", { message: err?.response?.data?.message });
    }
    setLoading(false);
  };

  return (
    <StyledContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Sign In</h2>
        <TextField
          id="email"
          label="Email"
          variant="standard"
          error={!!errors.email}
          helperText={errors.email?.message}
          disabled={loading}
          {...register("email")}
        />
        <TextField
          id="password"
          label="Password"
          variant="standard"
          error={!!errors.password}
          helperText={errors.password?.message}
          type="password"
          disabled={loading}
          {...register("password")}
        />
        <p>
          Don't have an account yet? <Link to="/auth/signup">Sign Up</Link>
        </p>
        <Button variant="contained" type="submit" disabled={loading}>
          Sign In
        </Button>
      </form>
    </StyledContainer>
  );
}

export default Component;
