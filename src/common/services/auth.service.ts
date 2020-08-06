import { Http, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';

// Config Module
import { environment } from 'env';
import { HttpUtilsService } from 'src/common/utils';

@Injectable()
export class AuthService {
    headers: RequestOptions;

    constructor(
        private http: Http,
        private httpService: HttpUtilsService
    ) {
        this.headers = this.httpService.getHTTPHeaders();
    }

    /**
     * Login
     * @param {*} requestBody
     */
    login(requestBody: object) {
        return this.http.post(
            environment.API_ADMIN_URI + '/v1/auth/login?group=web',
            requestBody,
            this.headers
        ).toPromise().then(result => result.json());
    }
}
