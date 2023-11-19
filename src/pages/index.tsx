import useAuthProvider from '@/context/AuthContext';
import { FormEvent, useState } from 'react';

export default function Home() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const { signIn, isAuthenticated } = useAuthProvider();

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		const data = { email, password };

		await signIn(data);
	}

	return (
		<form
			className={`flex min-h-screen gap-5 flex-col items-center justify-center text-black bg-white border border-black`}
			onSubmit={handleSubmit}
		>
			<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`border border-black`} />
			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className={`border border-black`}
			/>
			<button type="submit" className={`border border-black bg-gray-50`}>
				Entrar
			</button>
		</form>
	);
}
