import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Tajawal', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Primary brand red for the Tax Authority.
                brand: {
                    50: '#FDF3F3',
                    100: '#FAE0E1',
                    200: '#F3C0C3',
                    300: '#E9969B',
                    400: '#DD6B71',
                    500: '#BF373E',
                    600: '#A52E35',
                    700: '#8A252B',
                    800: '#6E1E23',
                    900: '#521619',
                },
                // Complementary deep navy accent (secondary buttons, badges).
                navy: {
                    50: '#F0F4F9',
                    100: '#DCE6F0',
                    200: '#B9CBE0',
                    300: '#8FAACB',
                    400: '#5F85AE',
                    500: '#3C6390',
                    600: '#2B4B74',
                    700: '#1E3A5F',
                    800: '#162B46',
                    900: '#101E32',
                },
            },
            boxShadow: {
                card: '0 1px 2px 0 rgb(16 30 50 / 0.05), 0 4px 16px -4px rgb(16 30 50 / 0.10)',
                'card-hover': '0 2px 4px 0 rgb(16 30 50 / 0.06), 0 12px 28px -8px rgb(16 30 50 / 0.18)',
            },
        },
    },

    plugins: [forms],
};
