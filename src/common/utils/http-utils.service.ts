// Angular
import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';

// Modules
import { Storage } from '../models';

@Injectable()
export class HttpUtilsService {
    /**
     * Prepare query http params
     * @param queryParams: QueryParamsModel
     */
    getFindHTTPParams(queryParams): HttpParams {
        let params = new HttpParams();
        Promise.all([
            Object.keys(queryParams).map(el => {
                const value = queryParams[el];
                if (value !== undefined) params = params.set(el, value);
            })
        ]);
        return params;
    }

    /**
     * Get authorize header
     */
    getHTTPHeaders() {
        /** get session */
        const _token = localStorage.getItem(
            Storage.TOKEN
        );

        /** append to headers */
        const _headers = new Headers();
        _headers.append('Cache-Control', 'no-cache');
        _headers.append('Content-Type', 'application/json');
        _headers.append('Authorization', `Bearer ${_token}`);

        /** convert to header options */
        return new RequestOptions({
            headers: _headers
        });
    }

    /**
     * get standard content-type
     */
    getHttpClientHeaders(): HttpHeaders {
        // TODO:: Get session
        const _token = localStorage.getItem(
            Storage.TOKEN
        );

        // TODO:: Set headers
        const result = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${_token}`);

        return result;
    }

    /**
     * Load jwt token
     */
    loadJwtToken = () => {
        /** get session */ /** get session */
        const _token = localStorage.getItem(
            Storage.TOKEN
        );
        return `Bearer ${_token}`;
    }
}
