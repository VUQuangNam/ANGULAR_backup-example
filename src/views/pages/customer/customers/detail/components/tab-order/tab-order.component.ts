import { Component, ViewEncapsulation, Input, Output, EventEmitter, OnInit } from '@angular/core';

// Plugins
import { ToastrService } from 'ngx-toastr';

// Modules
import { OrderService } from 'src/common/services';
import { Helpers, TypesUtilsService } from 'src/common/utils';
import { Order, OrderNormalStatuses, ErrorModel } from 'src/common/models';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'tab-customer-order',
    templateUrl: './tab-order.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        OrderService
    ]
})

export class TabCustomerOrderComponent implements OnInit {
    // Variables
    orders: any = [];
    collums: any = [];
    customerId: string;

    constructor(
        private toastrService: ToastrService,
        private typeService: TypesUtilsService,
        private service: OrderService,
        private route: ActivatedRoute,
        private helpers: Helpers
    ) {
        const config = new Order();
        this.collums = config.collums;
    }

    async ngOnInit() {
        this.customerId = this.route.snapshot.paramMap.get('id');
        await this.service.list({
            skip: 0,
            limit: 50,
            keyword: this.customerId
        } as any).then(res => {
            if (res.code) {
                const error = new ErrorModel(res);
                this.toastrService.warning(error.getMessage);
                return false;
            }
            this.orders = res.data.map(el => {
                // Pipe status
                el.status_name = OrderNormalStatuses[el.status.toUpperCase()];
                el.status_payment = el.total_unpaid ? 'Chưa thanh toán hết' : 'Đã thanh toán';

                // Pipe date
                el.created_at = this.typeService.formatDate(
                    el.created_at,
                    'DD/MM/YYYY hh:mm'
                );
                el.updated_at = this.typeService.formatDate(
                    el.updated_at,
                    'DD/MM/YYYY hh:mm'
                );
                return el;
            });
        }).catch(ex => {
            throw Error(ex);
        }).finally(() => {
            this.helpers.closeLoading();
        });
    }
}
