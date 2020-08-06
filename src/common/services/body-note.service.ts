import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Config Module
import { environment } from 'env';
import { HttpUtilsService } from 'src/common/utils';

@Injectable()
export class BodyNoteService {
    headers: HttpHeaders;
    API_URI = environment.API_ADMIN_URI + '/v1/note-history';

    constructor(
        private http: HttpClient,
        private httpService: HttpUtilsService
    ) {
        this.headers = this.httpService.getHttpClientHeaders();
    }

    /**
     * List
     *
     * @param {*} queryParams object
     * @param {*} customer_id required
     */
    list(params) {
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
     * @param {*} requestBody
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
     * Create
     *
     * @param {Object} data
     * @param {String} noteId
     */
    delete({ noteId, data }) {
        return this.http.post(
            this.API_URI + '/' + noteId,
            {
                values: data.values,
                customer_id: data.customer_id
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
}
