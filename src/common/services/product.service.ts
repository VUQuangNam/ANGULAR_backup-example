import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Config Module
import { environment } from 'env';
import { HttpUtilsService } from 'src/common/utils';

// Modules
import { Product } from '../models';

// Schema
export interface ProductFilter {
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
export class ProductService {
    headers: HttpHeaders;
    API_URI = environment.API_ADMIN_URI + '/v1/products';

    constructor(
        private http: HttpClient,
        private httpService: HttpUtilsService
    ) {
        this.headers = this.httpService.getHttpClientHeaders();
    }

    keyHistories() {
        return [
            {
                key: 'name',
                text: 'Tên sản phẩm',
                type: 'string'
            },
            {
                key: 'barcode',
                text: 'Barcode',
                type: 'string'
            },
            {
                key: 'description',
                text: 'Mô tả',
                type: 'string'
            },
            {
                key: 'category_id',
                text: 'category_id',
                type: 'string'
            },
            {
                key: 'properties',
                sub_key: 'unit',
                text: 'Đơn vị',
                type: 'string'
            },
            {
                key: 'properties',
                sub_key: 'gender',
                text: 'Giới tính',
                type: 'string'
            },
            {
                key: 'properties',
                sub_key: 'brand',
                text: 'Thương hiệu',
                type: 'string'
            },
            {
                key: 'origin_price',
                text: 'Giá gốc',
                type: 'number'
            },
            {
                key: 'service_price',
                text: 'Giá dịch vụ',
                type: 'number'
            },
            {
                key: 'price',
                text: 'Giá bán',
                type: 'number'
            },
            {
                key: 'fabric',
                sub_key: 'id',
                text: 'Mã vải',
                type: 'string'
            },
            {
                key: 'design_styles',
                text: 'Thay đổi kiểu dáng',
                type: 'object'
            },
            {
                key: 'design_extras',
                text: 'Thay đổi thiết kế nâng cao',
                type: 'object'
            },
            {
                key: 'design_advances',
                text: 'Thay đổi dịch vụ mở rộng',
                type: 'object'
            },
            {
                key: 'is_public',
                text: 'Hiển thị trên website',
                type: 'string'
            },
            {
                key: 'cut_process',
                sub_key: 'complete_at',
                text: 'Ngày cắt',
                type: 'date'
            },
            {
                key: 'cut_process',
                sub_key: 'complete_by',
                text: 'Nhân viên cắt',
                type: 'string'
            },
            {
                key: 'prepare_process',
                sub_key: 'complete_at',
                text: 'Ngày chuẩn bị may',
                type: 'date'
            },
            {
                key: 'prepare_process',
                sub_key: 'complete_by',
                text: 'Nhân viên chuẩn bị may',
                type: 'string'
            },
            {
                key: 'sew_process',
                sub_key: 'complete_at',
                text: 'Ngày may',
                type: 'date'
            },
            {
                key: 'sew_process',
                sub_key: 'complete_by',
                text: 'Nhân viên may',
                type: 'string'
            },
            {
                key: 'kcs_one_process',
                sub_key: 'complete_at',
                text: 'Giai đoạn KC1',
                type: 'date'
            },
            {
                key: 'kcs_one_process',
                sub_key: 'complete_by',
                text: 'Nhân viên KC1',
                type: 'string'
            },
            {
                key: 'complete_process',
                sub_key: 'complete_at',
                text: 'Giai đoạn hoàn thiện',
                type: 'date'
            },
            {
                key: 'complete_process',
                sub_key: 'complete_by',
                text: 'Nhân viên hoàn thiện',
                type: 'string'
            },
            {
                key: 'kcs_two_process',
                sub_key: 'complete_at',
                text: 'Giai đoạn KC2',
                type: 'date'
            },
            {
                key: 'kcs_two_process',
                sub_key: 'complete_by',
                text: 'Nhân viên KC2',
                type: 'string'
            },
            {
                key: 'storage_process',
                sub_key: 'complete_at',
                text: 'Giai đoạn lưu kho',
                type: 'date'
            },
            {
                key: 'storage_process',
                sub_key: 'complete_by',
                text: 'Nhân viên lưu kho',
                type: 'string'
            },
            {
                key: 'storage_process',
                sub_key: 'location',
                text: 'Vị trí lưu kho',
                type: 'string'
            }
        ];
    }

    /**
     * List
     *
     * @param {String} queryParams
     */
    list(params: any) {
        params.groups = 'product';
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
    create(requestBody: Product) {
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

    histories(productId: string) {
        return this.http.get(
            environment.API_ADMIN_URI + '/v1/histories/products?id=' + productId + '&events=app_event.updated',
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
    update(id: string, requestBody: any) {
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
