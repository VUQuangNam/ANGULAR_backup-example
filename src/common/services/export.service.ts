import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Config Module
import { environment } from 'env';
import { HttpUtilsService } from 'src/common/utils';

// Modules
import { Export, ExportStatuses } from '../models';

// Schema
export interface ExportFilter {
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
export class ExportService {
    headers: HttpHeaders;
    API_URI = environment.API_ADMIN_URI + '/v1/exports';

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
    list(params: ExportFilter) {
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
    create(requestBody: any) {
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
    update(id: string, requestBody: Export) {
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
     * Verify
     * @param {*} id
     * @param {*} requestBody
     */
    verify(id: string, requestBody: object) {
        return this.http.post(
            this.API_URI + `/verify/${id}`,
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
            {
                status: ExportStatuses.CONFIRMED
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
     * Cancel
     * @param {String} id
     * @param {String} reason
     */
    cancel(id: string, reason: string) {
        return this.http.post(
            this.API_URI + `/cancel/${id}`,
            {
                reason: reason,
                status: ExportStatuses.CANCELLED
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
