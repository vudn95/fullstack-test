import { TextField, Button } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import request from "../../../utils/request";
import { StyledContainer } from "./styles";

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
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    try {
      const responseData = await request().post("/auth/signup", data);
      navigate("/auth/signin");
      console.log("responseData: ", responseData);
    } catch (err) {
      console.log("err: ", err);
    }
  };

  console.log("errors: ", errors);

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
          {...register("firstName")}
        />
        <TextField
          id="lastName"
          label="Last Name"
          variant="standard"
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          {...register("lastName")}
        />
        <TextField
          id="email"
          label="Email"
          variant="standard"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email")}
        />
        <TextField
          id="password"
          label="Password"
          variant="standard"
          error={!!errors.password}
          helperText={errors.password?.message}
          type="password"
          {...register("password")}
        />
        <TextField
          id="passwordConfirm"
          label="PasswordConfirm"
          variant="standard"
          error={!!errors.passwordConfirm}
          helperText={errors.passwordConfirm?.message}
          type="password"
          {...register("passwordConfirm")}
        />
        <Button variant="contained" type="submit">
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
