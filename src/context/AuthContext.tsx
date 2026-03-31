import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearAuthSession,
  getAuthSession,
  login as apiLogin,
  me,
  register as apiRegister,
  type User,
} from "../services/api";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser(): Promise<void> {
    const session = getAuthSession();

    if (!session.token) {
      setUser(null);
      return;
    }

    try {
      const response = await me();
      setUser(response.user);
    } catch {
      clearAuthSession();
      setUser(null);
    }
  }

  useEffect(() => {
    async function bootstrapAuth() {
      try {
        await refreshUser();
      } finally {
        setLoading(false);
      }
    }

    void bootstrapAuth();
  }, []);

  async function handleLogin(email: string, password: string): Promise<void> {
    const response = await apiLogin({ email, password });
    localStorage.setItem("token", response.token);
    setUser(response.user);
  }

  async function handleRegister(
    name: string,
    email: string,
    password: string
  ): Promise<void> {
    const response = await apiRegister({ name, email, password });
    localStorage.setItem("token", response.token);
    setUser(response.user);
  }

  function handleLogout() {
    clearAuthSession();
    setUser(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      refreshUser,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}