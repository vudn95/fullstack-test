import { request } from "./utils/request";
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

interface AuthState {
  isLoadingProfile: boolean;
  isAuthenticated: boolean;
  user: IUser | null;
  accessToken?: { accessToken: string };
}

interface AuthContextType extends AuthState {
  setAccessToken: (data: { accessToken: string }) => void;
  isHasAccessToken: () => boolean;
  setLoadingProfile: (value: boolean) => void;
  setUserData: (user: IUser) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  isLoadingProfile: false,
  isAuthenticated: false,
  user: null,
};

type AuthAction =
  | { type: "SET-USER-DATA"; payload: IUser }
  | { type: "LOGOUT" }
  | { type: "SET-LOADING-PROFILE"; payload: boolean }
  | { type: "SET-ACCESS-TOKEN"; payload: { accessToken: string } };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET-ACCESS-TOKEN":
      return {
        ...state,
        accessToken: action.payload,
      };
    case "SET-USER-DATA":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isLoadingProfile: false,
        isAuthenticated: false,
        user: null,
      };
    case "SET-LOADING-PROFILE":
      return {
        ...state,
        isLoadingProfile: action.payload,
      };
    default:
      return state;
  }
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setAccessToken = (tokenData: { accessToken: string }) => {
    localStorage.setItem("accessToken", JSON.stringify(tokenData));
    dispatch({ type: "SET-ACCESS-TOKEN", payload: tokenData });
  };

  const isHasAccessToken = () => {
    return Boolean(localStorage.getItem("accessToken") || state.accessToken);
  };

  const setLoadingProfile = (loading: boolean) => {
    dispatch({ type: "SET-LOADING-PROFILE", payload: loading });
  };

  const setUserData = useCallback((user: IUser) => {
    localStorage.setItem("userData", JSON.stringify(user));
    dispatch({ type: "SET-USER-DATA", payload: user });
  }, []);

  const logout = () => {
    localStorage.removeItem("userData");
    dispatch({ type: "LOGOUT" });
  };

  const checkUserDataWhenLoadingAppFirstTime = useCallback(async () => {
    const storedAccessToken = localStorage.getItem("accessToken");
    let token = "";

    if (storedAccessToken) {
      try {
        token = JSON.parse(storedAccessToken)?.accessToken;
      } catch (e) {
        console.error("Can not get access token on localStorage: ", e);
      }
    }

    if (token) {
      try {
        setLoadingProfile(true);
        await request({}, { Authorization: `Bearer ${token}` })
          .get("/auth/my-profie")
          .then((responseData) => {
            setUserData(responseData.data);
            setLoadingProfile(false);
          });
      } catch (err) {
        setLoadingProfile(false);
      }
    }
  }, [setUserData]);

  useEffect(() => {
    checkUserDataWhenLoadingAppFirstTime();
  }, [checkUserDataWhenLoadingAppFirstTime]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        setUserData,
        setAccessToken,
        isHasAccessToken,
        setLoadingProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };
