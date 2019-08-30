import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FuseConfigService} from '@fuse/services/config.service';
import {takeUntil} from 'rxjs/operators';
import {DOCUMENT} from '@angular/common';
import {FuseNavigationService} from '@fuse/components/navigation/navigation.service';
import {FuseSidebarService} from '@fuse/components/sidebar/sidebar.service';
import {FuseSplashScreenService} from '@fuse/services/splash-screen.service';
import {FuseTranslationLoaderService} from '@fuse/services/translation-loader.service';
import {TranslateService} from '@ngx-translate/core';
import {Platform} from '@angular/cdk/platform';
import {navigation} from 'app/navigation/navigation';
import {locale as navigationEnglish} from 'app/navigation/i18n/en';
import {locale as navigationPersian} from 'app/navigation/i18n/fa';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

    fuseConfig: any;
    navigation: any;
    directionLang = 'rtl';
    lang ='fa';
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private _platform: Platform
    ) {
        // Get default navigation
        this.navigation = navigation;
        // Register the navigation to the service
        this._fuseNavigationService.register('main', this.navigation);

        // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation('main');

        // Add languages
        this._translateService.addLangs(['en', 'fa']);

        // Set the default language
        this._translateService.setDefaultLang('fa');

        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(navigationEnglish, navigationPersian);

        // Use a language
        this._translateService.use('fa');
        /*        document.getElementsByTagName("html")[0].setAttribute('lang', this.lang);
                document.getElementsByTagName("body")[0].setAttribute('dir', this.directionLang);

                this._translateService.onLangChange.subscribe((event) => {
                    this.lang = event.lang;
                    if (event.lang == 'fa') {
                        this.directionLang = 'rtl';
                    }
                    else {
                        this.directionLang = 'ltr';
                    }
                    document.getElementsByTagName("html")[0].setAttribute('lang', this.lang);
                    document.getElementsByTagName("body")[0].setAttribute('dir', this.directionLang);
                });*/

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix Start
         * ----------------------------------------------------------------------------------------------------
         */

        /**
         * If you are using a language other than the default one, i.e. Turkish in this case,
         * you may encounter an issue where some of the components are not actually being
         * translated when your app first initialized.
         *
         * This is related to ngxTranslate module and below there is a temporary fix while we
         * are moving the multi language implementation over to the Angular's core language
         * service.
         **/

        // Set the default language to 'en' and then back to 'tr'.
        // '.use' cannot be used here as ngxTranslate won't switch to a language that's already
        // been selected and there is no way to force it, so we overcome the issue by switching
        // the default language back and forth.
        /**
         setTimeout(() => {
            this._translateService.setDefaultLang('en');
            this._translateService.setDefaultLang('tr');
         });
         */

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix End
         * ----------------------------------------------------------------------------------------------------
         */

        // Add is-mobile class to the body if the platform is mobile
        if (this._platform.ANDROID || this._platform.IOS) {
            this.document.body.classList.add('is-mobile');
        }

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

  ngOnInit() { // Subscribe to config changes
      this._fuseConfigService.config
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((config) => {

              this.fuseConfig = config;

              // Boxed
              if ( this.fuseConfig.layout.width === 'boxed' )
              {
                  this.document.body.classList.add('boxed');
              }
              else
              {
                  this.document.body.classList.remove('boxed');
              }

              // Color theme - Use normal for loop for IE11 compatibility
              for ( let i = 0; i < this.document.body.classList.length; i++ )
              {
                  const className = this.document.body.classList[i];

                  if ( className.startsWith('theme-') )
                  {
                      this.document.body.classList.remove(className);
                  }
              }

              this.document.body.classList.add(this.fuseConfig.colorTheme);
          });

  }
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void
    {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

}
