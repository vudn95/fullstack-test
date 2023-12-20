import { TextField, Button } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import request from "../../../utils/request";
import { StyledContainer } from "./styles";
import { useState } from "react";

const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("First Name is required"),
  email: yup.string().required("Email is required").email("Email invalid"),
  password: yup.string().required("Password is required"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required"),
});

interface Inputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
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
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    try {
      setLoading(true);
      await request().post("/auth/signup", data);
      navigate("/auth/signin");
    } catch (err: any) {
      if (err?.response?.data?.message?.email === "AlreadyExists") {
        setError("email", { message: "This email is already exists" });
      } else {
        // handle some thing went wrong here
      }
    }
    setLoading(false);
  };

  return (
    <StyledContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Sign Up</h2>
        <TextField
          id="firstName"
          label="First Name"
          variant="standard"
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
          disabled={loading}
          {...register("firstName")}
        />
        <TextField
          id="lastName"
          label="Last Name"
          variant="standard"
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          disabled={loading}
          {...register("lastName")}
        />
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
        <TextField
          id="passwordConfirm"
          label="PasswordConfirm"
          variant="standard"
          error={!!errors.passwordConfirm}
          helperText={errors.passwordConfirm?.message}
          type="password"
          disabled={loading}
          {...register("passwordConfirm")}
        />
        <Button variant="contained" type="submit" disabled={loading}>
          Sign Up
        </Button>
        <p>
          You already had an account? <Link to="/auth/signin">Sign In</Link>
        </p>
      </form>
    </StyledContainer>
  );
}

export default Component;
