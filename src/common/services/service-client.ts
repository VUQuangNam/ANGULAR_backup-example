import { Http, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';

// Config Module
import { environment } from 'env';
import { HttpUtilsService } from 'src/common/utils';

@Injectable()
export class ServiceClient {
    headers: RequestOptions;

    constructor(
        private http: Http,
        private httpService: HttpUtilsService
    ) {
        this.headers = this.httpService.getHTTPHeaders();
    }

    /**
     * Get method
     *
     * @param {String} route
     */
    get(route): Promise<JSON> {
        return this.http.get(
            environment.API_ADMIN_URI + route,
            this.headers
        ).toPromise().then(result => result.json());
    }

    /**
     * Post method
     *
     * @param {String} route
     * @param {Object} requestBody
     */
    create(route: string, requestBody: any): Promise<JSON> {
        return this.http.post(
            environment.API_ADMIN_URI + route,
            requestBody,
            this.headers
        ).toPromise().then(result => result.json());
    }

}
