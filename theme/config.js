import { NativeBaseProvider, extendTheme } from 'native-base';

const theme = extendTheme({
    fontConfig: {
        oswald: {
            100: {
                normal: 'Oswald_200ExtraLight',
            },
            200: {
                normal: 'Oswald_300Light',
            },
            300: {
                normal: 'Oswald_300Light',
            },
            400: {
                normal: 'Oswald_400Regular',
            },
            500: {
                normal: 'Oswald_500Medium',
            },
            600: {
                normal: 'Oswald_500Medium',
            },

            700: {
                normal: 'Oswald_600SemiBold',
            },
            800: {
                normal: 'Oswald_700Bold',
            },

        },
    },

    // Make sure values below matches any of the keys in `fontConfig`
    fonts: {
        heading: 'oswald',
        body: 'oswald',
        mono: 'oswald',
    },
    config: {
        useSystemColorMode: false,
        initialColorMode: "dark",
    }
});

export default theme;