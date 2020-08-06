import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Config Module
import { environment } from 'env';
import { HttpUtilsService } from 'src/common/utils';

// Schema
export interface DesignFilter {
    // $sort
    skip: number;
    limit: number;

    // $search
    keyword: string;
    genders: string;
    categories: string;
}

@Injectable()
export class DesignService {
    headers: HttpHeaders;
    API_DESIGN_URI = environment.API_ADMIN_URI + '/v1/design-config';
    API_DESIGN_EXTRA_URI = environment.API_ADMIN_URI + '/v1/design-extra-config';
    API_DESIGN_ADVANCE_URI = environment.API_ADMIN_URI + '/v1/design-advance-config';

    constructor(
        private http: HttpClient,
        private httpService: HttpUtilsService
    ) {
        this.headers = this.httpService.getHttpClientHeaders();
    }

    /**
     * List design styles
     *
     * @param {String} queryParams
     */
    listStyles(params?: any) {
        return this.http.get(
            this.API_DESIGN_URI,
            {
                params: this.httpService.getFindHTTPParams(params || {}),
                headers: this.headers
            }
        ).toPromise().then(
            result => JSON.parse(
                JSON.stringify(result)
            )
        );
    }

    /**
     * List design extras
     *
     * @param {String} queryParams
     */
    listExtras(params?: any) {
        return this.http.get(
            this.API_DESIGN_EXTRA_URI,
            {
                params: this.httpService.getFindHTTPParams(params || {}),
                headers: this.headers
            }
        ).toPromise().then(
            result => JSON.parse(
                JSON.stringify(result)
            )
        );
    }

    /**
     * List design advances
     *
     * @param {String} queryParams
     */
    listAdvances(params?: any) {
        return this.http.get(
            this.API_DESIGN_ADVANCE_URI,
            {
                params: this.httpService.getFindHTTPParams(params || {}),
                headers: this.headers
            }
        ).toPromise().then(
            result => JSON.parse(
                JSON.stringify(result)
            )
        );
    }
}
