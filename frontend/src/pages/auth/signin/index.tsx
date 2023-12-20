import { TextField, Button } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import request from "../../../utils/request";
import { StyledContainer } from "./styles";
import { useAuth } from "../../../AuthContext";

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
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    try {
      const responseData = await request().post("/auth/signin", data);
      login(responseData as unknown as IUser);
      navigate("/dashboard/profile");
      console.log("responseData: ", responseData);
    } catch (err) {
      console.log("err: ", err);
    }
  };

  console.log("errors: ", errors);

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
          {...register("email")}
        />
        <TextField
          id="password"
          label="Password"
          variant="standard"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register("password")}
        />
        <p>
          Don't have an account yet? <Link to="/auth/signup">Sign Up</Link>
        </p>
        <Button variant="contained" type="submit">
          Sign In
        </Button>
      </form>
    </StyledContainer>
  );
}

export default Component;
