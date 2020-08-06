import { Injectable } from '@angular/core';
import { environment } from 'env';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { HttpUtilsService } from 'src/common/utils';

@Injectable()
export class ProductionService {
    headers: HttpHeaders;
    API_URI = environment.API_ADMIN_URI + '/v1/order-items';
    constructor(
        private http: HttpClient,
        private httpService: HttpUtilsService
    ) {
        this.headers = this.httpService.getHttpClientHeaders();
    }
    /**
     * Status orders
     */
    statuses = {
        picking: {
            name: 'Đặt hàng',
            color: 'warning',
            id: 'picking'
        },
        pending: {
            name: 'Chờ sản xuất ',
            color: 'warning',
            id: 'pending'
        },
        confirmed: {
            name: 'Đã duyệt',
            color: 'success',
            id: 'confirmed'
        },
        production: {
            name: 'Sản xuất',
            color: 'info',
            id: 'production'
        },
        delivered: {
            name: 'Đã giao hàng',
            color: 'primary',
            id: 'delivered'
        },
        delivering: {
            name: 'Vận chuyển',
            color: 'primary',
            id: 'delivering'
        },
        completed: {
            name: 'Đã hoàn thành',
            color: 'brand',
            id: 'completed'
        },
        cancelled: {
            name: 'Đã hủy',
            color: 'danger',
            id: 'cancelled'
        },
        cutting: {
            name: 'Đang cắt',
            color: 'cutting',
            id: 'cutting'
        },
        preparing: {
            name: 'Chuẩn bị may',
            color: 'preparing',
            id: 'preparing'
        },
        sewing: {
            name: 'Đang may',
            color: 'sewing',
            id: 'sewing'
        },
        kcs_one: {
            name: 'KCS1',
            color: 'kcs_one',
            id: 'kcs_one'
        },
        completing: {
            name: 'Hoàn thiện',
            color: 'completing',
            id: 'completing'
        },
        kcs_two: {
            name: 'KCS2',
            color: 'kcs_two',
            id: 'kcs_two'
        },
        storage: {
            name: 'Lưu kho',
            color: 'storage',
            id: 'storage'
        },
    };

    list(params: any) {
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
     * assign item
     * @param {String} id
     */
    assign(id: string, data: any, idProduct: any) {
        return this.http.post(
            environment.API_ADMIN_URI + '/v1/order-items/assign/' + id + `?product_id=${idProduct}`,
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

    detail(id: string, idOrder?: string) {
        return this.http.get(
            environment.API_ADMIN_URI + '/v1/order-items/' + idOrder + `?product_id=${id}`,
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
     * process item
     * @param {Any} data
     */
    process(data: any) {
        return this.http.post(
            environment.API_ADMIN_URI + '/v1/order-items/change-process', data,
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
