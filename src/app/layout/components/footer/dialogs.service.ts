import { Injectable } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {TravelOptionsComponent} from 'app/shared/travel-options/travel-options.component';

@Injectable({
  providedIn: 'root'
})
export class DialogsService {

  constructor(private dialog: MatDialog) { }

    openDialogTravelOptions() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        this.dialog.open(TravelOptionsComponent, dialogConfig);
    }
}
