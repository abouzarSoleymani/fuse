import { FuseConfig } from '@fuse/types';


export const fuseConfig: FuseConfig = {
    // Color themes can be defined in src/app/app.theme.scss
    colorTheme      : 'theme-default',
    customScrollbars: true,
    layout          : {
        style    : 'vertical-layout-1',
        width    : 'fullwidth',
        navbar   : {
            primaryBackground  : 'fuse-navy-700',
            secondaryBackground: 'fuse-navy-900',
            folded             : false,
            hidden             : false,
            position           : 'right',
            variant            : 'vertical-style-1'
        },
        toolbar  : {
            customBackgroundColor: false,
            background           : 'fuse-white-500',
            hidden               : false,
            position             : 'below-static'
        },
        toolbarTravelOptions: {
            customBackgroundColor: false,
            background           : 'fuse-white-500',
            hidden               : true,
            position             : 'above'
        },
        bodyWaitingNearDriver: {
            customBackgroundColor: false,
            background           : 'fuse-white-500',
            hidden               : true,
            position             : 'above'
        },
        bodyDriverScore: {
            customBackgroundColor: false,
            background           : 'fuse-white-500',
            hidden               : true,
            position             : 'above'
        },
        footer   : {
            customBackgroundColor: true,
            background           : 'fuse-navy-50',
            hidden               : true,
            position             : 'below-fixed'
        },
        footerDriverDetail   : {
            customBackgroundColor: true,
            background           : 'fuse-navy-50',
            hidden               : true,
            position             : 'below-fixed'
        },
        footerDriverOptions   : {
            customBackgroundColor: true,
            background           : 'fuse-navy-50',
            hidden               : true,
            position             : 'below-fixed'
        },
        sidepanel: {
            hidden  : true,
            position: 'right'
        }
    }
};
