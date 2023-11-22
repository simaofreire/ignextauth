import { api } from '@/services/api';
import Router from 'next/router';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

type SignInCredentials = {
	email: string;
	password: string;
};

type AuthContextData = {
	signIn(credentials: SignInCredentials): Promise<void>;
	user: User;
	isAuthenticated: boolean;
};

type User = {
	email: string;
	permissions: string[];
	roles: string[];
};

const AuthContext = createContext({} as AuthContextData);

type AuthProviderProps = {
	children: ReactNode;
};

export function signOut() {
	destroyCookie(undefined, 'nextauth.token');
	destroyCookie(undefined, 'nextauth.refreshToken');
	Router.push('/');
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setuser] = useState<User>({ email: '', permissions: [], roles: [] });
	const isAuthenticated = !!user;

	async function signIn({ email, password }: SignInCredentials) {
		try {
			const {
				data: { permissions, roles, token, refreshToken },
				status
			} = await api.post('/sessions', { email, password });
			if (status === 200) {
				setuser({ email, permissions, roles });
				setCookie(undefined, 'nextauth.token', token, {
					maxAge: 60 * 60 * 24 * 30, // 30 days
					path: '/'
				});
				setCookie(undefined, 'nextauth.refreshToken', refreshToken);
				api.defaults.headers['Authorization'] = `Bearer ${token}`;
				history.push('/dashboard');
			}
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		const { 'nextauth.token': token } = parseCookies();

		if (token) {
			api
				.get('/me')
				.then((res) => {
					const { email, permissions, roles } = res.data;
					setuser({ email, permissions, roles });
				})
				.catch(() => {
					signOut;
					history.push('/');
				});
		}
	}, []);

	return <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>{children}</AuthContext.Provider>;
}

export default function useAuth() {
	const context = useContext(AuthContext);

	if (!context) throw new Error('useAuth must be used within a Provider');

	return context;
}
