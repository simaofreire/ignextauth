import { ReactNode, createContext, useContext } from 'react';

type SignInCredentials = {
	email: string;
	password: string;
};

type AuthContextData = {
	signIn(credentials: SignInCredentials): Promise<void>;
	isAuthenticated: boolean;
};

const AuthContext = createContext({} as AuthContextData);

type AuthProviderProps = {
	children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
	const isAuthenticated = false;

	async function signIn({ email, password }: SignInCredentials) {
		console.log({ email, password });
	}

	return <AuthContext.Provider value={{ signIn, isAuthenticated }}>{children}</AuthContext.Provider>;
}


export default function useAuthProvider() {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuthProvider must be used within a Provider');

  return context;
}
