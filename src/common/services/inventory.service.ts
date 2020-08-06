import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Config Module
import { environment } from 'env';
import { HttpUtilsService } from 'src/common/utils';

// Schema
export interface InventoryFilter {
    page?: number;
    skip: number;
    limit: number;
    sortBy: string;
    orderBy: string;

    // $search
    keyword: string;
    groups: string;
    types: string;
    categories: string;
    is_public: string;
}

@Injectable()
export class InventoryService {
    headers: HttpHeaders;
    API_URI = environment.API_ADMIN_URI + '/v1/products';

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
}
