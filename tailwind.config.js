const colors = require('tailwindcss/colors');

module.exports = {
    // configure-tailwind-to-remove-unused-styles-in-production
    mode: 'jit',
    purge: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        extend: {
            width: {
                108: '27rem',
                120: '30rem',
            },
            backgroundImage: {
                'split-emerald-white':
                    'linear-gradient(to bottom, #3cb371 60% , white 40%);',
            },
        },
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            white: colors.white,
            'blue-gray': colors.blueGray,
            'cool-gray': colors.coolGray,
            gray: colors.gray,
            'true-gray': colors.trueGray,
            'warm-gray': colors.warmGray,
            red: colors.red,
            orange: colors.orange,
            yellow: colors.yellow,
            amber: colors.amber,
            lime: colors.lime,
            green: colors.green,
            emerald: colors.emerald,
            teal: colors.teal,
            cyan: colors.cyan,
            sky: colors.sky,
            'light-blue': colors.sky,
            blue: colors.blue,
            indigo: colors.indigo,
            violet: colors.violet,
            fuchsia: colors.fuchsia,
            pink: colors.pink,
            rose: colors.rose,
            black: colors.black,
            'gt-blue': {
                200: '#b3d5eb',
                300: '#1790e0',
                400: '#147CC1',
                500: '#0E5C90',
            },
            'gt-gray': {
                300: '#F0F5FB',
                400: '#E6EAF0',
            },
        },
        container: {
            center: true,
        },
        borderRadius: {
            none: '0px',
            sm: '.125rem',
            DEFAULT: '.25rem',
            md: '.375rem',
            lg: '.5rem',
            xl: '.75rem',
            '2xl': '1rem',
            '3xl': '1.5rem',
            '4xl': '2rem',
            '5xl': '2.5rem',
            '6xl': '3rem',
            '7xl': '3.5rem',
            '8xl': '4rem',
            '9xl': '4.5rem',
            '10xl': '5rem',
            full: '9999px',
        },
    },
    variants: {
        extend: {
            textColor: ['focus-within', 'group-focus'],
            borderColor: ['focus-within', 'group-focus'],
            borderWidth: ['first', 'last'],
            borderRadius: ['first', 'last'],
            backgroundColor: ['disabled'],
            opacity: ['disabled'],
        },
    },
    plugins: [],
};
