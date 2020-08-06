import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Config Module
import { environment } from 'env';
import { HttpUtilsService } from 'src/common/utils';

@Injectable()
export class UploadService {
    // Variables
    API_URI = environment.API_UPLOAD_URI + '/v1/images';

    constructor(
        private http: HttpClient,
        private httpService: HttpUtilsService
    ) { }

    /**
     * Folder upload
     *
     * @public
     */
    UploadGroup = {
        USER: 'users',
        PRODUCT: 'products',
        EMPLOYEE: 'employee',
        CUSTOMER: 'customers',
        CATEGORY: 'categories'
    };

    single(formData: any, category: string) {
        return this.http.post(
            // this.API_URI + '/upload-single/' + category,
            `${this.API_URI}/upload-single?group=${category}`,
            formData,
            {
                headers: {
                    Authorization: this.httpService.loadJwtToken()
                }
            },
        ).toPromise().then(
            result => JSON.parse(
                JSON.stringify(result)
            )
        );
    }

    multiple(formData: any, category: string) {
        return this.http.post(
            `${this.API_URI}/upload-multiple?group=${category}`,
            formData,
            {
                headers: {
                    Authorization: this.httpService.loadJwtToken()
                }
            },
        ).toPromise().then(
            result => JSON.parse(
                JSON.stringify(result)
            )
        );
    }
}
