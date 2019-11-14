import { Injectable } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {FuseConfigService} from '@fuse/services/config.service';
import {LocalStorageService} from 'app/core/service/local-storage.service';
import 'leaflet';
declare let L;

@Injectable({
  providedIn: 'root'
})
export class ConfigRideLayoutService {

    config = {
        layout: {
            navbar   : {
                hidden: false
            },
            toolbar  : {
                hidden: false
            },
            toolbarTravelOptions: {
                hidden: true
            },
            bodyWaitingNearDriver: {
                hidden: true
            },
            bodyDriverScore: {
                hidden: true
            },
            footer   : {
                hidden: true
            },
            footerDriverDetail : {
                hidden: true
            },
            footerDriverOptions : {
                hidden: true
            },
            sidepanel: {
                hidden: true
            }
        }
    };

  constructor(private _fuseConfigService: FuseConfigService,
              private localStorage: LocalStorageService) {}
f

  changeLayoutRideOption(state){
      if(state == 0){
          this.initialConfig();
      }else
          if(state == 1){
          this.config.layout.footerDriverOptions.hidden = false;
      }else
          if(state == 2){
          this.config.layout.footerDriverOptions.hidden = true;
          this.config.layout.bodyWaitingNearDriver.hidden = false;
          this.localStorage.updateItem('ride', {waitingStatus: true});
       }/*else
          if(state == 3){
              this.config.layout.footerDriverOptions.hidden = true;
              this.config.layout.bodyWaitingNearDriver.hidden = true;
              this.config.layout.navbar.hidden = true;
              this._fuseConfigService.setConfig(this.config);
          }*/ else
              if(state == 3){
                  console.log('*******************************1111111111111111111')
                  this.config.layout.footerDriverOptions.hidden = true;
              this.config.layout.bodyWaitingNearDriver.hidden = true;
              this.config.layout.footerDriverDetail.hidden = false;
              this.config.layout.toolbarTravelOptions.hidden = false;
              this.localStorage.updateItem('ride', {DriverEnroute: true});
          }else
              if(state == 4){
                  this.localStorage.updateItem('ride', {ReadyForPickup: true});
              }else
                  if(state == 5){
                      this.localStorage.updateItem('ride', {PassengerOnBoard: true});
                  }else
                      if(state == 6){
                          console.log('************************tamam**********************')
                          this.config.layout.footerDriverOptions.hidden = true;
                          this.config.layout.toolbarTravelOptions.hidden = true;
                          this.config.layout.bodyDriverScore.hidden = false;
                          this.localStorage.updateItem('ride', {ReachedDestination: true});
                      }
      console.log('init2')
      this._fuseConfigService.setConfig(this.config);

  }

  initialConfig(){
      console.log('init')
      this.config = {
          layout: {
              navbar   : {
                  hidden: false
              },
              toolbar  : {
                  hidden: false
              },
              toolbarTravelOptions: {
                  hidden: true
              },
              bodyWaitingNearDriver: {
                  hidden: true
              },
              bodyDriverScore: {
                  hidden: true
              },
              footer   : {
                  hidden: true
              },
              footerDriverDetail : {
                  hidden: true
              },
              footerDriverOptions : {
                  hidden: true
              },
              sidepanel: {
                  hidden: true
              }
          }
      };
  }
}
