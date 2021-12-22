import '../styles/globals.css';
import { useEffect } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';

function App({ Component, pageProps }) {
    const queryClient = new QueryClient();

    // * Dark Mode
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    useEffect(() => {
        const isDarkModeChosen = window.localStorage.theme === 'dark';
        const isOsThemeDark =
            !('theme' in window.localStorage) &&
            window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDarkModeEnabled = isDarkModeChosen || isOsThemeDark;

        document
            .querySelector('html')
            .classList.toggle('dark', isDarkModeEnabled);
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default App;
