import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Config Module
import { environment } from 'env';
import { HttpUtilsService } from 'src/common/utils';

// Modules
import { Store } from '../models';

// Schema
export interface StoreFilter {
    // $sort
    page?: number;
    skip: number;
    limit: number;
    sortBy: string;
    orderBy: string;

    // $search
    keyword: string;
}

@Injectable()
export class StoreService {
    headers: HttpHeaders;
    API_URI = environment.API_ADMIN_URI + '/v1/stores';

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
    list(params?: any) {
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
     * @param {Customer} requestBody
     */
    create(requestBody: Store) {
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
    detail(id: any) {
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
     * @param {Customer} requestBody
     */
    update(id: string, requestBody: Store) {
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
