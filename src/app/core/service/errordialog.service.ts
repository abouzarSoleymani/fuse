import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class ErrorDialogService {
    constructor() { }
    openDialog(data, success, typeDialog): any {
        if(typeDialog == 'console'){
                console.log(data);
        }else{
            if(success == 1){      //success
                Swal.fire({
                    type: 'success',
                    text: data,
                    confirmButtonText: 'باشه'
                })
            } else if(success == 2 || success == 0 ){    //error
                Swal.fire({
                    type: 'error',
                    text: data,
                    confirmButtonText: 'باشه'
                })
            }
        }


    }
}