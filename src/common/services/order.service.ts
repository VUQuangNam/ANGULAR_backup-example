import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Config Module
import { environment } from 'env';
import { HttpUtilsService } from 'src/common/utils';

// Modules
import { Order } from '../models';

// Schema
export interface OrderFilter {
    page?: number;
    skip: number;
    limit: number;
    sortBy: string;
    orderBy: string;
    keyword: string;
}

@Injectable()
export class OrderService {
    headers: HttpHeaders;
    API_URI = environment.API_ADMIN_URI + '/v1/orders';

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
    list(params: OrderFilter) {
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

    listPayment(params: any) {
        return this.http.get(
            environment.API_ADMIN_URI + '/v1/payments',
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
     * @param {*} requestBody
     */
    create(requestBody: Order) {
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
     * @param {*} id
     * @param {*} requestBody
     */
    update(id: string, requestBody: Order) {
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
     * @param {*} id
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

    cancel(id: string) {
        return this.http.post(
            this.API_URI + '/cancel/' + id,
            {},
            {
                headers: this.headers
            }
        ).toPromise().then(
            result => JSON.parse(
                JSON.stringify(result)
            )
        );
    }

    payment(id: string, data) {
        return this.http.post(
            this.API_URI + '/payment/' + id,
            data,
            {
                headers: this.headers
            }
        ).toPromise().then(
            result => JSON.parse(
                JSON.stringify(result)
            )
        );
    }

    complete(id: string, data) {
        return this.http.post(
            this.API_URI + '/complete/' + id,
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

    confirm(id: string, data) {
        return this.http.post(
            this.API_URI + '/confirm/' + id,
            data,
            {
                headers: this.headers
            }
        ).toPromise().then(
            result => JSON.parse(
                JSON.stringify(result)
            )
        );
    }

    delivered(data) {
        return this.http.post(
            environment.API_ADMIN_URI + '/v1/deliveries/',
            data,
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
