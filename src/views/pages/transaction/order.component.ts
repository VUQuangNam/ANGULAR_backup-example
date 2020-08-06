import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { cloneDeep } from 'lodash';

import { OrderService } from 'src/common/services';
import { Order, Storage, OrderNormalStatuses, PaymentStatuses } from 'src/common/models';
import { Helpers, TypesUtilsService } from 'src/common/utils';

@Component({
    selector: '.c-body',
    templateUrl: './order.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        OrderService
    ]
})

export class OrderComponent implements OnInit {
    filters: any = [];
    collums: any = [];
    filterSub: any = [];
    collumSub: any = [];
    stores: any = [];
    orders: any = [];
    queryParams: any = {};
    titles = '';
    routerLink = '';

    isFirstLoad = true;
    pageTotal = 0;

    constructor(
        private service: OrderService,
        private route: ActivatedRoute,
        private router: Router,
        private helper: Helpers,
        private typeService: TypesUtilsService,
    ) {
        const type = window.location.href.split('/')[4];
        // Load Configuration
        const model = new Order();
        switch (type) {
            case 'sale_available':
                this.titles = 'Đơn hàng bán sẵn';
                this.queryParams.types = type;
                this.routerLink = 'orders/' + type;
                this.collums = [...model.collumsAvailable] as [];
                this.filters = [...model.filtersAvailable] as [];
                break;
            case 'tailor':
                this.titles = 'Đơn hàng may đo';
                this.collums = [...model.collumsTailor] as [];
                this.filters = [...model.filtersTailor] as [];
                this.queryParams.types = type;
                this.routerLink = 'orders/' + type;
                break;
            case 'tailor_at_home':
                this.titles = 'Đơn hàng may đo tại nhà';
                this.collums = [...model.collumsTailor] as [];
                this.filters = [...model.filtersTailor] as [];
                this.queryParams.types = type;
                this.routerLink = 'orders/' + type;
                break;
            case 'service':
                this.titles = 'Đơn hàng bảo hành sửa chữa';
                this.collums = [...model.collumsTailor] as [];
                this.filters = [...model.filtersTailor] as [];
                this.queryParams.types = type;
                this.routerLink = 'orders/' + type;
                break;
            case 'ecommerce':
                this.titles = 'Đơn hàng online';
                this.collums = [...model.collumsAvailable] as [];
                this.filters = [...model.filtersAvailable] as [];
                this.queryParams.types = type;
                this.routerLink = 'orders/' + type;
                break;
            case 'uniform':
                this.titles = 'Đơn hàng đồng phục';
                this.collums = [...model.collumsTailor] as [];
                this.filters = [...model.filtersTailor] as [];
                this.queryParams.types = type;
                this.routerLink = 'orders/' + type;
                break;
            case 'pending':
                this.titles = 'Chờ thu ngân';
                this.collums = [...model.collums] as [];
                this.filters = [...model.filters] as [];
                this.queryParams.statuses = type;
                this.routerLink = 'orders/' + type;
                break;
            case 'payments':
                this.titles = 'Đã thu trong kỳ';
                this.collums = [...model.collumsPayments] as [];
                this.filters = [...model.filtersPayments] as [];
                this.queryParams.statuses = type;
                this.routerLink = 'payments';
                break;
            default:
                this.collums = [...model.collums] as [];
                this.filters = [...model.filters] as [];
                this.routerLink = 'orders';
                break;
        }

        this.stores = JSON.parse(
            localStorage.getItem(
                Storage.STORES
            )
        );
    }

    ngOnInit() {
        this.route.queryParamMap.subscribe(async (queryParams: Params) => {
            this.helper.openLoading();
            if (this.isFirstLoad) {
                this.isFirstLoad = false;
                this.router.navigate([this.routerLink]);
            }
            // Perpare parmas
            const params = cloneDeep(queryParams.params);
            if (!params.stores || !params.stores.length) {
                params.stores = this.stores.map(x => x.id);
            }
            const limit = params.limit || 20;
            const page = parseInt(params.page || 0, 10);
            const skip = limit * (page <= 0 ? 0 : page - 1);
            this.queryParams = Object.assign({ skip, limit }, params);
            const type = window.location.href.split('/')[4];
            // Load Configuration
            const model = new Order();
            switch (type) {
                case 'sale_available':
                    this.queryParams.types = type;
                    break;
                case 'tailor':
                    this.queryParams.types = type;
                    break;
                case 'tailor_at_home':
                    this.queryParams.types = type;
                    break;
                case 'service':
                    this.queryParams.types = type;
                    break;
                case 'ecommerce':
                    this.queryParams.types = type;
                    break;
                case 'uniform':
                    this.queryParams.types = type;
                    break;
                case 'pending':
                    this.queryParams.statuses = type;
                    break;
                case 'payments':
                    this.queryParams.statuses = type;
                    break;
                default:
                    this.collums = [...model.collums] as [];
                    this.filters = [...model.filters] as [];
                    this.routerLink = 'orders';
                    break;
            }
            if (this.routerLink === 'payments') {
                await this.service.listPayment(
                    this.queryParams
                ).then(respone => {
                    if (respone.code) {
                        this.orders = [];
                        alert(respone.message);
                        return null;
                    }
                    this.pageTotal = respone.count;
                    this.orders = respone.data.map(el => {
                        // Pipe status
                        el.status_name = OrderNormalStatuses[el.status.toUpperCase()];
                        if (el.total_unpaid > 0) {
                            el.status_payment = PaymentStatuses.UNPAID;
                        } else {
                            el.status_payment = PaymentStatuses.PAID;
                        }

                        // Pipe date
                        el.created_at = this.typeService.formatDate(
                            el.created_at,
                            'DD/MM/YYYY hh:mm'
                        );

                        el.payment_method_name = this.onCheckPaymentHistory(el.payment_method);

                        // Pipe date
                        el.updated_at = this.typeService.formatDate(
                            el.updated_at,
                            'DD/MM/YYYY hh:mm'
                        );

                        // Pipe date
                        el.consult_process.complete_at = this.typeService.formatDate(
                            el.consult_process.complete_at,
                            'DD/MM/YYYY hh:mm'
                        );

                        el.deadline = this.typeService.formatDate(
                            el.deadline,
                            'DD/MM/YYYY hh:mm'
                        );

                        el.measure_process.complete_at = this.typeService.formatDate(
                            el.measure_process.complete_at,
                            'DD/MM/YYYY hh:mm'
                        );

                        el.preview_process.one = this.typeService.formatDate(
                            el.preview_process.one,
                            'DD/MM/YYYY hh:mm'
                        );

                        el.preview_process.two = this.typeService.formatDate(
                            el.preview_process.two,
                            'DD/MM/YYYY hh:mm'
                        );

                        el.preview_process.three = this.typeService.formatDate(
                            el.preview_process.three,
                            'DD/MM/YYYY hh:mm'
                        );

                        el.receive_process.date = this.typeService.formatDate(
                            el.receive_process.date,
                            'DD/MM/YYYY hh:mm'
                        );
                        return el;
                    });

                    const rowTotalQuantity = {
                        id: 'Tổng',
                        total_before_discount: 0,
                        total_discount: 0,
                        total_paid: 0,
                        total_unpaid: 0,
                        total_point: 0,
                        total_price: 0
                    };
                    if (this.orders.length) {
                        this.handleEventReloadTotalPrice(rowTotalQuantity);
                        Object.keys(this.orders[0]).forEach(x => {
                            rowTotalQuantity[x] = rowTotalQuantity[x] || '';
                        });
                    }
                    this.orders = this.orders.length ? [rowTotalQuantity].concat(this.orders) : this.orders;
                }).catch(ex => {
                    throw ex;
                }).finally(() => {
                    this.helper.closeLoading();
                });
            } else {
                await this.service.list(
                    this.queryParams
                ).then(respone => {
                    if (respone.code) {
                        this.orders = [];
                        alert(respone.message);
                        return null;
                    }
                    this.pageTotal = respone.count;
                    this.orders = respone.data.map(el => {
                        // Pipe status
                        el.status_name = OrderNormalStatuses[el.status.toUpperCase()];
                        if (el.total_unpaid > 0) {
                            el.status_payment = PaymentStatuses.UNPAID;
                        } else {
                            el.status_payment = PaymentStatuses.PAID;
                        }

                        // Pipe date
                        el.created_at = this.typeService.formatDate(
                            el.created_at,
                            'DD/MM/YYYY hh:mm'
                        );

                        el.payment_method_name = this.onCheckPaymentHistory(el.payment_method);

                        // Pipe date
                        el.updated_at = this.typeService.formatDate(
                            el.updated_at,
                            'DD/MM/YYYY hh:mm'
                        );

                        // Pipe date
                        el.consult_process.complete_at = this.typeService.formatDate(
                            el.consult_process.complete_at,
                            'DD/MM/YYYY hh:mm'
                        );

                        el.deadline = this.typeService.formatDate(
                            el.deadline,
                            'DD/MM/YYYY hh:mm'
                        );

                        el.measure_process.complete_at = this.typeService.formatDate(
                            el.measure_process.complete_at,
                            'DD/MM/YYYY hh:mm'
                        );

                        el.preview_process.one = this.typeService.formatDate(
                            el.preview_process.one,
                            'DD/MM/YYYY hh:mm'
                        );

                        el.preview_process.two = this.typeService.formatDate(
                            el.preview_process.two,
                            'DD/MM/YYYY hh:mm'
                        );

                        el.preview_process.three = this.typeService.formatDate(
                            el.preview_process.three,
                            'DD/MM/YYYY hh:mm'
                        );

                        el.receive_process.date = this.typeService.formatDate(
                            el.receive_process.date,
                            'DD/MM/YYYY hh:mm'
                        );
                        return el;
                    });

                    if (this.queryParams.payment_status) {
                        let data = [];
                        this.queryParams.payment_status.forEach(condition => {
                            switch (condition) {
                                case 'unpaid':
                                    data = data.concat(this.orders.filter(x => x.total_unpaid > 0));
                                    break;
                                case 'paid':
                                    data = data.concat(this.orders.filter(x => x.total_unpaid <= 0));
                                    break;
                                default:
                                    break;
                            }
                        });
                        this.orders = data;
                    }

                    const rowTotalQuantity = {
                        id: 'Tổng',
                        total_before_discount: 0,
                        total_discount: 0,
                        total_paid: 0,
                        total_unpaid: 0,
                        total_point: 0,
                        total_price: 0
                    };
                    if (this.orders.length) {
                        this.handleEventReloadTotalPrice(rowTotalQuantity);
                        Object.keys(this.orders[0]).forEach(x => {
                            rowTotalQuantity[x] = rowTotalQuantity[x] || '';
                        });
                    }
                    this.orders = this.orders.length ? [rowTotalQuantity].concat(this.orders) : this.orders;
                }).catch(ex => {
                    throw ex;
                }).finally(() => {
                    this.helper.closeLoading();
                });
            }
        });
    }

    onCheckPaymentHistory = (value) => {
        try {
            switch (value) {
                case 1:
                    return 'Thanh toán tiền mặt';
                    break;
                case 2:
                    return 'Thanh toán quẹt thẻ';
                    break;
                case 3:
                    return 'Thanh toán thẻ nội địa';
                    break;
                case 4:
                    return 'Thanh toán thẻ VISA MASTER CARD';
                    break;
                default:
                    break;
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    handleEventReloadTotalPrice = (rowTotalQuantity) => {
        this.orders.forEach(data => {
            rowTotalQuantity.total_before_discount = rowTotalQuantity.total_before_discount + data.total_before_discount;
            rowTotalQuantity.total_discount = rowTotalQuantity.total_discount + data.total_discount;
            rowTotalQuantity.total_paid = rowTotalQuantity.total_paid + data.total_paid;
            rowTotalQuantity.total_unpaid = rowTotalQuantity.total_unpaid + data.total_unpaid;
            rowTotalQuantity.total_point = rowTotalQuantity.total_point + data.total_point;
            rowTotalQuantity.total_price = rowTotalQuantity.total_price + data.total_price;
        });
    }


    onChangeCollum(collumId: string) {
        const collums = this.collums;
        collums.map(
            x => x.id === collumId
                ? x.active = !x.active
                : x.active = x.active
        );
        this.collums = [...collums];
    }

    // onDownloadData = async ($event) => {
    //     $event.preventDefault();
    //     try {
    //         this.orders = this.orders.filter(x => x.id !== 'Tổng');
    //         if (this.orders.length) {
    //             const rawFile = await $.get('./assets/template/print-order.html');
    //             let listOrrder = '';
    //             this.orders.forEach((data, index) => {
    //                 listOrrder += `
    //                     <tr>
    //                         <td>${index + 1}</td>
    //                         <td>${data.id || ''}</td>
    //                         <td>${data.store.id || ''}</td>
    //                         <td>${data.customer.name || ''}</td>
    //                         <td>${data.total_before_discount || 0}</td>
    //                         <td>${data.total_discount || 0}</td>
    //                         <td>${data.total_paid || 0}</td>
    //                         <td>${data.total_unpaid || 0}</td>
    //                         <td>${this.statuses[data.status].name || ''}</td>
    //                         <td>${data.total_unpaid > 0 ? 'Chưa thanh toán hết' : 'Đã thanh toán hết'}</td>
    //                         <td>${this.dateConfig.format(data.created_at)}</td>
    //                         <td>${data.source || ''}</td>
    //                         <td>${data.deadline ? this.dateConfig.format(data.deadline) : 'Chưa cập nhật'}</td>
    //                     </tr>
    //                 `;
    //             });
    //             const template = rawFile.replace(/{{TABLE_DATA}}/g, listOrrder);
    //             const dateTime = moment(Date.now()).format('DD-MM-YYYY');
    //             this.utilities.exportToExecel(`don-hang- ${dateTime}.xls`, template);
    //         }
    //     } catch (ex) {
    //         /*begin:: write log ex here: break*/
    //         throw new Error(ex);
    //     }
    // }
}
