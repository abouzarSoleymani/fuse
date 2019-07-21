import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse, HttpHeaders
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {ErrorDialogService} from 'app/core/service/errordialog.service';
import {LocalStorageService} from 'app/core/service/local-storage.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(public errorDialogService: ErrorDialogService,
                private localStorage: LocalStorageService,
                 private spinner: NgxSpinnerService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.spinner.show();
        console.log(this.spinner.show())
        const token =  this.localStorage.getItem('user');
        console.log(token.data[0].iPassengerId)
        if (token) {
            const headers = new HttpHeaders({
                'security_key':  token.data[0].security_key,
                'obj_id': (token.data[0].iPassengerId).toString(),
                'type': 'passenger'
            });
            request = request.clone({headers});

    /*        cloneRequest = request.clone({ headers: request.headers
                    .set('security_key', token.data[0].security_key)
                    .set('obj_id', token.data[0].iPassengerId)
                    .set('type', 'passenger') });*/
        }
        console.log(request)
        if (!request.headers.has('Content-Type')) {
            console.log(request.headers)
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }

        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });


        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                this.spinner.hide();
                console.log(this.spinner.hide());
                if (event instanceof HttpResponse) {
                    //console.log('event--->>>', event);
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                this.spinner.hide();
                let data = {};
                data = {
                    reason: error && error.error && error.error.reason ? error.error.reason : '',
                    status: error.status
                };
                this.errorDialogService.openDialog(data, 2, 'console');
                return throwError(error);
            }));
    }
}