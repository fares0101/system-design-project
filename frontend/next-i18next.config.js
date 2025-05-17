/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'ar'],
    },
    localePath: 'public/locales',
    reloadOnPrerender: process.env.NODE_ENV === 'development',
}; 