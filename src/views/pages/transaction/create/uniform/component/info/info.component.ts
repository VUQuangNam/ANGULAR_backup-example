import { Component, ViewEncapsulation, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { RankService, CustomerService, StoreService, StaffService } from 'src/common/services';
import { TypesUtilsService } from 'src/common/utils';
import { BaseConfig } from 'src/config';

@Component({
    selector: 'dunnio-information-order-create-uniform',
    templateUrl: './info.component.html',
    styleUrls: ['./style.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        StaffService,
        CustomerService,
        RankService,
        StoreService,
        TypesUtilsService
    ]
})

export class InformationOrderUniformComponent implements OnInit {
    /** public variable */
    @Input() data: any = {};
    @Output() callback = new EventEmitter<object>();

    /** variable */
    serviceStores: any = [];
    employees: any = [];
    customers: any = [];
    keypress: any;
    loading = {
        measure_process: false,
        consult_process: false,
        customer: false,
        giftcode: false
    };
    isDiscountRank = 0;
    isValueCoin = 0;
    sources: any = [];

    constructor(
        private customerService: CustomerService,
        private staffService: StaffService,
        private rankService: RankService,
        private storeService: StoreService,
        private typeService: TypesUtilsService,
        private baseConfig: BaseConfig
    ) { }

    async ngOnInit() {
        /** load store from service */
        const stores = await this.storeService.list({
            skip: 0,
            limit: 100
        });
        this.serviceStores = stores.data || [];
        const respone = await this.staffService.list({
            skip: 0,
            limit: 1000
        });
        this.employees = respone.data || [];
        if (this.employees.length) {
            this.employees.forEach(x => {
                x.fullText = x.phone + ' ' + x.name + ' ' + x.id;
            });
        }
        this.sources = this.baseConfig.sourceOrderConfig;
    }

    onConfirmCartInfo = () => {
        this.callback.emit({
            data: null,
            type: 'onConfirmCartInfo'
        });
    }

    onSearchEmployee = (keyword: string, key) => {
        this.loading[key] = true;
        clearTimeout(this.keypress);
        this.keypress = setTimeout(
            async () => {
                try {
                    if (!keyword) return;
                    return this.employees.map(x => x.fullText = x.phone + ' ' + x.name);
                } catch (ex) {
                    return this.employees = [];
                } finally {
                    this.loading[key] = false;
                }
            }, 500);
    }

    onRemoveEmployee = (value) => {
        if (value === 1) {
            this.data.measure_process.complete_by = null;
        }
        if (value === 2) {
            this.data.consult_process.complete_by = null;
        }
    }

    onSearchCustomer = (keyword: string) => {
        this.loading.customer = true;
        clearTimeout(this.keypress);
        this.keypress = setTimeout(
            async () => {
                try {
                    if (!keyword) return;
                    const respone = await this.customerService.list({
                        skip: 0,
                        limit: 20,
                        keyword: keyword
                    });
                    const data = respone.code ? [] : respone.data;
                    this.customers = data.map(x => {
                        return {
                            id: x.id,
                            name: x.name,
                            phone: x.phone,
                            address: x.address,
                            total_point: x.total_point,
                            birthday: x.birthday
                                ? this.typeService.formatDate(
                                    x.birthday,
                                    'DD/MM/YYYY hh:mm'
                                ) : null,
                            fullText: x.phone + ' ' + x.name
                        };
                    });

                    return this.customers;
                } catch (ex) {
                    return this.customers = this.customers || [];
                } finally {
                    this.loading.customer = false;
                }
            }, 500);
    }

    onSelectCustomer = async (customer) => {
        if (customer) {
            delete customer.fullText;
            this.data.customer = customer;
        }
        if (customer.rank_id) {
            const respone = await this.rankService.detail(customer.rank_id);
            this.isDiscountRank = respone.code === 0 ? respone.data.discount : 0;
            this.data.discounts.push({
                discount_method: 'rank',
                discount_type: 1,
                discount_value: this.isDiscountRank
            });
        }
        this.callback.emit({
            data: {
                type: 'rank',
                value: this.isDiscountRank,
            },
            type: 'handleEventReloadCartPayment'
        });
        this.callback.emit({
            data: null,
            type: 'onChangeBodyNoteMetris'
        });
    }

    onRemoveCustomer = () => {
        this.data.customer = null;
        this.data.discounts = this.data.discounts.filter(x => x.discount_method !== 'rank');
        this.callback.emit({
            data: {
                type: 'rank',
                value: 0,
            },
            type: 'handleEventReloadCartPayment'
        });
    }
}
