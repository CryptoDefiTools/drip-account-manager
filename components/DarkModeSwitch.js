import { useState, useEffect } from 'react';
import cn from 'classnames';

export const DarkModeSwitch = () => {
    const [mode, setMode] = useState();

    const toggleMode = (switchTo = mode === 'dark' ? 'light' : 'dark') => {
        setMode(switchTo);
    };

    useEffect(() => {
        const isDarkModeChosen = window.localStorage.theme === 'dark';
        const isOsThemeDark =
            !('theme' in window.localStorage) &&
            window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDarkModeEnabled = isDarkModeChosen || isOsThemeDark;

        setMode(isDarkModeEnabled ? 'dark' : 'light');
    }, []);

    useEffect(() => {
        document
            .querySelector('html')
            .classList.toggle('dark', mode === 'dark');
    }, [mode]);

    return (
        <div className="flex ml-auto">
            <div className="text-xs bg-gray-200 dark:bg-warm-gray-600 text-gray-500 dark:text-white leading-none border-2 border-gray-200 dark:border-gray-700 shadow-sm rounded-full inline-flex mx-auto">
                <button
                    title="Toggle Light Mode"
                    type="button"
                    onClick={() => toggleMode('light')}
                    className={cn(
                        'inline-flex items-center transition-colors duration-100 ease-in focus:outline-none  rounded-full p-2',
                        {
                            'bg-amber-400 text-white': mode === 'light',
                        }
                    )}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                    </svg>
                </button>
                <button
                    title="Toggle Dark Mode"
                    type="button"
                    onClick={() => toggleMode('dark')}
                    className={cn(
                        'inline-flex items-center transition-colors duration-100 ease-in focus:outline-none  rounded-full p-2',
                        {
                            'bg-yellow-200 text-black': mode === 'dark',
                        }
                    )}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};
