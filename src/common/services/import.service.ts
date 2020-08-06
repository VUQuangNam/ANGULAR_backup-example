import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Config Module
import { environment } from 'env';
import { HttpUtilsService } from 'src/common/utils';

// Modules
import { Import } from '../models';

// Schema
export interface ImportFilter {
    page?: number;
    skip: number;
    limit: number;
    sortBy: string;
    orderBy: string;

    // $search
    keyword: string;
    stores: string;
    statuses: string;
}

@Injectable()
export class ImportService {
    headers: HttpHeaders;
    API_URI = environment.API_ADMIN_URI + '/v1/imports';

    constructor(
        private http: HttpClient,
        private httpService: HttpUtilsService
    ) {
        this.headers = this.httpService.getHttpClientHeaders();
    }

    /**
     * List
     *
     * @param {String} queryParams
     */
    list(params: ImportFilter) {
        delete params.page;
        return this.http.get(
            this.API_URI,
            {
                params: this.httpService.getFindHTTPParams(params),
                headers: this.headers
            }
        ).toPromise().then(
            result => JSON.parse(
                JSON.stringify(result)
            )
        );
    }

    /**
     * Create
     * @param {Import} requestBody
     */
    create(requestBody: Import) {
        return this.http.post(
            this.API_URI,
            requestBody,
            {
                headers: this.headers
            }
        ).toPromise().then(
            result => JSON.parse(
                JSON.stringify(result)
            )
        );
    }

    /**
     * Detail
     * @param {String} id
     */
    detail(id: string) {
        return this.http.get(
            this.API_URI + `/${id}`,
            {
                headers: this.headers
            }
        ).toPromise().then(
            result => JSON.parse(
                JSON.stringify(result)
            )
        );
    }

    /**
     * Update
     * @param {String} id
     * @param {Import} requestBody
     */
    update(id: string, requestBody: Import) {
        return this.http.put(
            this.API_URI + `/${id}`,
            requestBody,
            {
                headers: this.headers
            }
        ).toPromise().then(
            result => JSON.parse(
                JSON.stringify(result)
            )
        );
    }

    /**
     * Confirm
     * @param {String} id
     */
    confirm(id: string) {
        return this.http.post(
            this.API_URI + `/confirm/${id}`,
            null,
            {
                headers: this.headers
            }
        ).toPromise().then(
            result => JSON.parse(
                JSON.stringify(result)
            )
        );
    }

    /**
     * Cancel
     * @param {String} id
     * @param {String} reason
     */
    cancel(id: string, reason: string) {
        return this.http.post(
            this.API_URI + `/cancel/${id}`,
            {
                reason: reason
            },
            {
                headers: this.headers
            }
        ).toPromise().then(
            result => JSON.parse(
                JSON.stringify(result)
            )
        );
    }

    /**
     * Delete
     * @param {String} id
     */
    delete(id: string) {
        return this.http.delete(
            this.API_URI + `/${id}`,
            {
                headers: this.headers
            }
        ).toPromise().then(
            result => JSON.parse(
                JSON.stringify(result)
            )
        );
    }
}
