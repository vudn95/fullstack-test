import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

interface AuthState {
  isAuthenticated: boolean;
  user: IUser | null;
}

interface AuthContextType extends AuthState {
  login: (user: IUser) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

type AuthAction = { type: "LOGIN"; payload: IUser } | { type: "LOGOUT" };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback((user: IUser) => {
    localStorage.setItem("userData", JSON.stringify(user));
    dispatch({ type: "LOGIN", payload: user });
  }, []);

  const logout = () => {
    localStorage.removeItem("userData");
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");

    if (storedUser) {
      const parsedUser: IUser = JSON.parse(storedUser);
      login(parsedUser);
    }
  }, [login]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
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
