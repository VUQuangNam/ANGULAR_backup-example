import { Observable } from 'rxjs';
import * as moment from 'moment-timezone';
import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Storage } from '../models';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        try {
            const token = localStorage.getItem(
                Storage.TOKEN
            );
            const expiredAt = localStorage.getItem(
                Storage.TOKEN_EXPIRED_AT
            );
            if (!token) {
                this.router.navigate(['login']);
                return false;
            }

            // TODO:: Check token

            if (
                moment(Date.now()).unix() >=
                parseInt(expiredAt, 10)
            ) {
                // TODO:: Refresh token
                alert('phiên đăng nhập đã hết hạn');
                localStorage.removeItem(Storage.USER);
                localStorage.removeItem(Storage.TOKEN);
                localStorage.removeItem(Storage.TOKEN_EXPIRED_AT);
                this.router.navigate(['login']);
                return false;
            }

            return true;
        } catch (ex) {
            this.router.navigate(['login']);
            return false;
        }
    }
}
