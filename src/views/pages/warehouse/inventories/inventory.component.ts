import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

// Plugins
import { cloneDeep, pick } from 'lodash';

// Modules
import { InventoryService } from 'src/common/services';
import { Helpers, TypesUtilsService } from 'src/common/utils';
import { Product } from 'src/common/models';

@Component({
    selector: '.c-body',
    templateUrl: './inventory.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        InventoryService
    ]
})

export class InventoryComponent implements OnInit {
    // Variable
    products: any = [];
    filters: any = [];
    collums: any = [];
    queryParams: any = {};
    paramRequired: any = {};
    currentUrl: string;
    component: string;
    isFirstLoad = true;
    pageTotal = 0;

    constructor(
        private helper: Helpers,
        private service: InventoryService,
        private typeService: TypesUtilsService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        // Load current url target
        this.currentUrl = this.router.url.split('?')[0];

        // Load Configuration
        const model = new Product();
        this.collums = model.stockCollums;
        switch (this.currentUrl) {
            case '/inventory/materials':
                this.filters = model.materialFilters;
                this.paramRequired = { groups: 'material' };
                this.component = 'materials';
                break;
            case '/inventory/product-availables':
                this.filters = model.productFilters;
                this.paramRequired = { groups: 'product', types: 'available' };
                this.component = 'products';
                break;
            case '/inventory/product-services':
                this.filters = model.serviceFilters;
                this.paramRequired = { groups: 'product', types: 'tailor,warranty,repair' };
                this.component = 'services';
                break;
            default:
                alert('Chức năng này không được hỗ trợ!');
                break;
        }
    }

    ngOnInit() {
        this.route.queryParamMap.subscribe(async (queryParams: Params) => {
            this.helper.openLoading();

            // check first load
            if (this.isFirstLoad) {
                this.isFirstLoad = false;
                this.router.navigate([this.currentUrl], { queryParams: this.paramRequired });
            }

            // Perpare parmas
            const params = cloneDeep(queryParams.params);
            if (params.types && !params.types.length && this.component === 'services') {
                params.types = 'tailor,repair,warranty';
            }
            params.limit = params.limit || 20;
            const page = parseInt(params.page || 0, 10);
            params.skip = params.limit * (page <= 0 ? 0 : page - 1);
            this.queryParams = Object.assign(this.paramRequired, params);

            // send request
            await this.service.list(
                this.queryParams
            ).then(respone => {
                if (respone.code) {
                    this.products = [];
                    alert(respone.message);
                    return null;
                }
                // parse data
                this.pageTotal = respone.count;
                this.products = respone.data.map(el => {
                    // parse stock
                    el.inventories.map(stock => {
                        el[stock.id.toLowerCase()] = stock.total_quantity;
                    });

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
                this.helper.closeLoading();
            });
        });
    }

    /**
     * Change Collum
     */
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
