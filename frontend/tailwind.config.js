/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                arabic: ['Cairo', 'sans-serif'],
            },
        },
    },
    plugins: [
        function ({ addUtilities }) {
            const formStyles = {
                '.form-input': {
                    'border-radius': '0.375rem',
                    'border-color': '#d1d5db',
                    'padding': '0.5rem 0.75rem',
                    'box-shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                },
                '.form-select': {
                    'border-radius': '0.375rem',
                    'border-color': '#d1d5db',
                    'padding': '0.5rem 2.5rem 0.5rem 0.75rem',
                    'box-shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                },
                '.form-checkbox': {
                    'border-radius': '0.25rem',
                    'border-color': '#d1d5db',
                    'width': '1rem',
                    'height': '1rem',
                }
            };
            addUtilities(formStyles);
        }
    ],
}; 