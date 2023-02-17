import '@/styles/globals.css'
import { PrivyProvider } from '@privy-io/react-auth';
import { useRouter } from 'next/router';
const privyId = process.env.NEXT_PUBLIC_PRIVY_ID

export default function App({ Component, pageProps }) {
    const router = useRouter();

    // This method will execute after a user successfully logs in.
    const handleLogin = async () => { 
        router.push('/');
    }
    
    return(
        <PrivyProvider appId={privyId} onSuccess={handleLogin} >
            <Component {...pageProps} />
        </PrivyProvider>
    );
}
