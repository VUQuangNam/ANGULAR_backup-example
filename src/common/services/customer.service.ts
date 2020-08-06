import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Config Module
import { environment } from 'env';
import { HttpUtilsService } from 'src/common/utils';

// Modules
import { Customer } from '../models';

// Schema
export interface CustomerFilter {
    page?: number;
    skip: number;
    limit: number;
    sortBy: string;
    orderBy: string;

    keyword: string;
    types: string;
    genders: string;
    provinces: string;

    min_price: number;
    max_price: number;

    min_debt: number;
    max_debt: number;

    min_birthday: Date;
    max_birthday: Date;

    min_time_create: Date;
    max_time_create: Date;

    min_time_purchase: Date;
    max_time_purchase: Date;
}

@Injectable()
export class CustomerService {
    headers: HttpHeaders;
    API_URI = environment.API_ADMIN_URI + '/v1/customers';

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
    list(params: any) {
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
     * @param {String} customerId
     */
    detail(customerId: any) {
        return this.http.get(
            this.API_URI + `/${customerId}`,
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
     * @param {String} customerId
     * @param {Customer} requestBody
     */
    update(customerId: string, requestBody: Customer) {
        return this.http.put(
            this.API_URI + `/${customerId}`,
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
     * @param {String} customerId
     */
    delete(customerId: string) {
        return this.http.delete(
            this.API_URI + `/${customerId}`,
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
