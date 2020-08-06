import { Component, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';

import { CustomerService, RankService, VoucherService } from 'src/common/services';
import { TypesUtilsService } from 'src/common/utils';
import { BaseConfig } from 'src/config';

@Component({
    selector: 'dunnio-information-order-create-available',
    templateUrl: './info.component.html',
    styleUrls: ['./style.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        CustomerService,
        RankService,
        VoucherService,
    ]
})

export class InformationOrderAvailableComponent {
    constructor(
        private customerService: CustomerService,
        private rankService: RankService,
        private typeService: TypesUtilsService,
        private baseConfig: BaseConfig
    ) {
        this.sources = this.baseConfig.sourceOrderConfig;
    }

    /** public variable */
    @Input() data;
    @Input() loading;
    @Output() callback = new EventEmitter<object>();

    /** variable */
    customers: any = [];
    keypress: any;
    sources: any = [];

    onConfirmCartInfo = () => {
        this.callback.emit({
            data: null,
            type: 'onConfirmCartInfo'
        });
    }

    onSearchCustomer = (keyword: string) => {
        this.loading.customer = true;
        clearTimeout(this.keypress);
        this.keypress = setTimeout(
            async () => {
                try {
                    if (!keyword) return;
                    const respone = await this.customerService.list({ skip: 0, limit: 100, keyword: keyword });
                    const data = respone.code ? [] : respone.data;
                    this.customers = data.map(x => {
                        return {
                            id: x.id,
                            name: x.name,
                            phone: x.phone,
                            address: x.address,
                            total_point: x.total_point,
                            rank_id: x.rank_id,
                            total_debt: x.total_debt,
                            birthday: x.birthday ? this.typeService.formatDate(x.birthday, 'DD/MM/YYYY hh:mm') : null,
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
            this.data.customer = customer;
            if (customer.rank_id) {
                const respone = await this.rankService.detail(customer.rank_id);
                const index = this.data.discounts.findIndex(x => x.discount_method === 'rank');
                if (index === -1) {
                    this.data.discounts.push({
                        discount_method: 'rank',
                        discount_type: 1,
                        discount_value: respone.code === 0 ? respone.data.discount : 0
                    });
                } else {
                    this.data.discounts[index] = {
                        discount_method: 'rank',
                        discount_type: 1,
                        discount_value: respone.code === 0 ? respone.data.discount : 0
                    };
                }
                this.callback.emit({
                    data: {
                        type: 'rank',
                        value: respone.code === 0 ? respone.data.discount : 0,
                    },
                    type: 'handleEventReloadCartPayment'
                });
            }
        }
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
