import { Injectable } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class DialogsService {

  constructor(private dialog: MatDialog) { }

    openDialogTravelOptions(component) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        this.dialog.open(component, dialogConfig);
    }
}
