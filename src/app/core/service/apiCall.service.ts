import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import {User} from 'app/model/user.model';
import {Observable} from 'rxjs';
import {ResponseApiModel} from 'app/model/responseApi.model';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ApiCallService {
    constructor(private http: HttpClient) { }
     getResponse(endPoint: string, data: any): Observable<ResponseApiModel<any>> {
        return this.http.post<ResponseApiModel<any>>(`${environment.apiBaseUrl}${endPoint}`, data);
    }
}