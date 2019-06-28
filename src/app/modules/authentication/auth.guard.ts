import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {tap} from 'rxjs/operators';
import {AppState} from 'app/reducers';
import {isLoggedIn} from 'app/modules/authentication/auth.selectors';



@Injectable()
export class AuthGuard implements CanActivate {


    constructor(private store: Store<AppState>, private router: Router) {
    }


    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean>  {

        return this.store
            .pipe(
                select(isLoggedIn),
                tap(loggedIn => {
                    console.log(loggedIn)
                    if (!loggedIn) {
                        this.router.navigateByUrl('/auth/login');
                    }

                })
            );

    }

}