import {User} from 'app/core/model/user.model';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {Md5} from 'ts-md5/dist/md5';
import {ResponseApiModel} from 'app/core/model/responseApi.model';
import {LocalStorageService} from 'app/core/service/local-storage.service';


@Injectable()
export class AuthService {

    constructor(private http: HttpClient,
                private localStorage: LocalStorageService) {
    }

    login(vEmail__vMobileNumber: string, pass: string): Observable<ResponseApiModel<any>> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json'
            })
        };
        const vPassword = Md5.hashStr(pass);
        const app_type = '1';
        const app_version = '1';
        const vDeviceToken = 'panel';
        return this.http.post<ResponseApiModel<any>>(`${environment.apiBaseUrl}passenger_login`, {vEmail__vMobileNumber, vPassword, app_type, app_version, vDeviceToken}, httpOptions);
    }

    register(user: User): Observable<ResponseApiModel<any>> {
        return this.http.post<ResponseApiModel<any>>(`${environment.apiBaseUrl}passenger_registration`, user);
    }
    verify(user: User): Observable<ResponseApiModel<any>> {
        return this.http.post<ResponseApiModel<any>>(`${environment.apiBaseUrl}passenger_validate_otp`, user);
    }
    resend(mobile: any): Observable<ResponseApiModel<any>> {
        return this.http.post<ResponseApiModel<any>>(`${environment.apiBaseUrl}passenger_resend_otp`, mobile);
    }
    forgotPassword(mobile: string): Observable<ResponseApiModel<any>> {
        return this.http.post<ResponseApiModel<any>>(`${environment.apiBaseUrl}passenger_resend_otp`, mobile);
    }



    /*    login(username: string, password: string) {
            return this.http.post<any>(`${environment.apiBaseUrl}/passenger_login`, { username, password })
                .pipe(map(user => {
                    // login successful if there's a jwt token in the response
                    if (user && user.token) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify(user));
                    }

                    return user;
                }));
        }*/
    logout(): void {
        // remove user from local storage to log user out
        this.localStorage.removeItem('user');
    }

}