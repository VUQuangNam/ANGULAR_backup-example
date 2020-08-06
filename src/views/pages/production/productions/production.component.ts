import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

// Plugins
import swal from 'sweetalert2';
import { cloneDeep } from 'lodash';

// Modules
import { OrderService } from 'src/common/services';
import { Helpers, TypesUtilsService } from 'src/common/utils';
import { Order, Storage, OrderNormalStatuses } from 'src/common/models';


@Component({
    selector: '.c-body',
    templateUrl: 'production.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        OrderService,
        TypesUtilsService
    ]
})

export class ProductionComponent implements OnInit {
    // Variables
    params: any = {};
    destroy = false;
    orders: any[];
    stores: [any];
    statuses: any = {};

    // filters
    filters: any = [];
    collums: any = [];
    filterSub: any = [];
    collumSub: any = [];

    // search
    pageTotal = 0;
    isFirstLoad = true;
    queryParams: any = {};

    constructor(
        private service: OrderService,
        private route: ActivatedRoute,
        private router: Router,
        private helpers: Helpers,
        private typeService: TypesUtilsService
    ) {
        const model = new Order();
        this.collums = [...model.collumsProduction] as [];
        this.filters = [...model.filtersProduction] as [];
        this.stores = JSON.parse(
            localStorage.getItem(
                Storage.STORES
            )
        );
    }

    ngOnInit() {
        this.route.queryParamMap.subscribe(async (queryParams: Params) => {
            try {
                this.helpers.openLoading();
                if (this.isFirstLoad) {
                    this.isFirstLoad = false;
                    this.router.navigate(['productions']);
                }
                // Perpare parmas
                const params = cloneDeep(queryParams.params);
                if (!params.stores || !params.stores.length) {
                    params.stores = this.stores.map(x => x.id);
                }
                if (!params.types) {
                    params.types = ['tailor_at_home', 'tailor', 'service'];
                }
                const limit = params.limit || 20;
                const page = parseInt(params.page || 0, 10);
                const skip = limit * (page <= 0 ? 0 : page - 1);
                this.queryParams = Object.assign({ skip, limit }, params);

                // submit request
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
                        // Pipe date
                        el.created_at = this.typeService.formatDate(
                            el.created_at,
                            'DD/MM/YYYY hh:mm'
                        );
                        if (el.deadline) {
                            el.deadline = this.typeService.formatDate(
                                el.deadline,
                                'DD/MM/YYYY hh:mm'
                            );
                        }
                        if (el.preview_process.one) {
                            el.preview_process_one = this.typeService.formatDate(
                                el.preview_process.one,
                                'DD/MM/YYYY hh:mm'
                            );
                        }

                        if (el.preview_process.two) {
                            el.preview_process_two = this.typeService.formatDate(
                                el.preview_process.two,
                                'DD/MM/YYYY hh:mm'
                            );
                        }

                        el.preview_process.three = this.typeService.formatDate(
                            el.preview_process.three * 1000,
                            'DD/MM/YYYY hh:mm'
                        );

                        el.receive_process.date = this.typeService.formatDate(
                            el.receive_process.date * 1000,
                            'DD/MM/YYYY hh:mm'
                        );
                        return el;
                    });
                });
            } catch (ex) {
                throw Error(ex);
            } finally {
                this.helpers.closeLoading();
            }
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
}
