import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        icon     : 'apps',
        children : [
            {
                id       : 'map',
                title    : 'Map',
                translate: 'NAV.MAP',
                type     : 'item',
                icon     : 'map',
                url  : '/main/map'
            }
        ]
    },
    {
        id      : 'pages',
        title   : 'Pages',
        type    : 'group',
        translate: 'NAV.PAGES',
        icon    : 'pages',
        children: [
            {
                id      : 'authentication',
                title   : 'Authentication',
                translate: 'NAV.AUTHENTICATION',
                type    : 'collapsable',
                icon    : 'lock',
/*                badge   : {
                    title: '10',
                    bg   : '#525e8a',
                    fg   : '#FFFFFF'
                },*/
                children: [
                    {
                        id   : 'login',
                        title: 'Login',
                        type : 'item',
                        translate: 'NAV.LOGIN',
                        url  : '/pages/auth/login'
                    },
                    {
                        id   : 'login-v2',
                        title: 'Login v2',
                        translate: 'NAV.LOGIN2',
                        type : 'item',
                        url  : '/pages/auth/login-2'
                    },
                    {
                        id   : 'register',
                        title: 'Register',
                        translate: 'NAV.REGISTER',
                        type : 'item',
                        url  : '/pages/auth/register'
                    },
                    {
                        id   : 'register-v2',
                        title: 'Register v2',
                        translate: 'NAV.REGISTER',
                        type : 'item',
                        url  : '/pages/auth/register-2'
                    },
                    {
                        id   : 'forgot-password',
                        title: 'Forgot Password',
                        translate: 'NAV.FORGOTPASSWORD',
                        type : 'item',
                        url  : '/pages/auth/forgot-password'
                    },
                    {
                        id   : 'forgot-password-v2',
                        title: 'Forgot Password v2',
                        translate: 'NAV.FORGOTPASSWORD2',
                        type : 'item',
                        url  : '/pages/auth/forgot-password-2'
                    },
                    {
                        id   : 'reset-password',
                        title: 'Reset Password',
                        translate: 'NAV.RESETPASSWORD',
                        type : 'item',
                        url  : '/pages/auth/reset-password'
                    },
                    {
                        id   : 'reset-password-v2',
                        title: 'Reset Password v2',
                        translate: 'NAV.RESETPASSWORD2',
                        type : 'item',
                        url  : '/pages/auth/reset-password-2'
                    },
                    {
                        id   : 'lock-screen',
                        title: 'Lock Screen',
                        translate: 'NAV.LOCKSCREEN',
                        type : 'item',
                        url  : '/pages/auth/lock'
                    },
                    {
                        id   : 'mail-confirmation',
                        title: 'Mail Confirmation',
                        translate: 'NAV.MAILCONFIRM',
                        type : 'item',
                        url  : '/pages/auth/mail-confirm'
                    }
                ]
            },
            {
                id   : 'coming-soon',
                title: 'Coming Soon',
                translate: 'NAV.COMINGSOON',
                type : 'item',
                icon : 'alarm',
                url  : '/pages/coming-soon'
            },
            {
                id      : 'errors',
                title   : 'Errors',
                translate: 'NAV.ERRORS',
                type    : 'collapsable',
                icon    : 'error',
                children: [
                    {
                        id   : '404',
                        title: '404',
                        translate: 'NAV.404',
                        type : 'item',
                        url  : '/pages/errors/error-404'
                    },
                    {
                        id   : '500',
                        title: '500',
                        translate: 'NAV.500',
                        type : 'item',
                        url  : '/pages/errors/error-500'
                    }
                ]
            },
            {
                id   : 'profile',
                title: 'Profile',
                translate: 'NAV.PROFILE',
                type : 'item',
                icon : 'person',
                url  : '/pages/profile'
            },
            {
                id   : 'faq',
                title: 'Faq',
                translate: 'NAV.FAQ',
                type : 'item',
                icon : 'help',
                url  : '/pages/faq'
            },
            {
                id   : 'logout',
                title: 'Logout',
                translate: 'NAV.LOGOUT',
                type : 'item',
                icon : 'exit_to_app',
                url  : '/pages/faq'
            },
        ]
    }
];
