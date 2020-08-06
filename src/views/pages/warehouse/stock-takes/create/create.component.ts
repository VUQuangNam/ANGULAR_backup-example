import { Component, ViewEncapsulation, OnInit } from '@angular/core';

// Plugins
import { ToastrService } from 'ngx-toastr';

// Modules
import { Helpers } from 'src/common/utils';
import { ErrorModel, Storage, StockTake } from 'src/common/models';
import { StockTakeService, InventoryService } from 'src/common/services';

@Component({
    selector: '.c-body',
    templateUrl: './create.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        StockTakeService,
        InventoryService
    ]
})

export class CreateStockTakeComponent implements OnInit {
    // Variables
    model: any = {};
    stores: any = [];


    // $search
    keypress: any;
    loading: boolean;
    searchData: any = [];

    constructor(
        private toastrService: ToastrService,
        private inventoryService: InventoryService,
        private service: StockTakeService,
        private helpers: Helpers
    ) {
        // Load configuration
        this.stores = JSON.parse(
            localStorage.getItem(Storage.STORES)
        );
    }

    ngOnInit() {
        // transform data
        this.model.items = [];
        this.model.store = this.stores[0];

        // final page load
        this.helpers.closeLoading();
    }

    /**
     * Change total actual
     * @param $event
     */
    onChangeTotalActual($event) {
        const id = $event.target.name;
        const value = $event.target.value;
        this.model.items.map(item => {
            if (item.id === id) {
                item.total_actual = parseInt(value, 10);
                item.total_adjustment = Math.ceil(item.total_actual - item.total_quantity);
                item.total_price = Math.ceil(item.price * item.total_actual);
            }
        });
    }

    /**
     * Search items
     * @param {*} $event
     */
    onSearch($event) {
        this.loading = true;
        clearTimeout(this.keypress);
        this.keypress = setTimeout(() => {
            const params = {
                skip: 0,
                limit: 20,
                keyword: $event.term
            };
            this.inventoryService.list(
                params as any
            ).then(res => {
                if (!res.code) {
                    this.searchData = res.data.map(el => {
                        el.total_actual = 0;
                        el.total_quantity = 0;
                        el.total_adjustment = 0;
                        if (el.inventories) {
                            const stock = el.inventories.find(x => x.id === this.model.store.id);
                            el.total_quantity = stock ? stock.total_quantity : 0;
                        }
                        return el;
                    });
                }
            }).catch(ex => {
                this.model.items = [];
                throw Error(ex);
            }).finally(() => {
                this.loading = false;
            });
        }, 500);
    }

    /**
     * Select item
     * @param {*} item
     */
    onSelectItem(item) {
        try {
            this.model.total_actual = 0;
            this.model.total_quantity = 0;
            this.model.total_adjustment = 0;
            const data = [...this.model.items];

            // trasnform data
            data.push(item);
            this.model.items = data;
        } catch (ex) {
            throw Error(ex);
        }
    }

    /**
     * Remove item
     * @param {*} itemId
     */
    onRemoveItem(itemId) {
        try {
            const index = this.model.items.findIndex(
                x => x.id === itemId
            );
            this.model.items.splice(
                index, 1
            );
        } catch (ex) {
            throw Error(ex);
        }
    }

    /**
     * Create customer
     * @param {*} f
     */
    onCreate() {
        this.helpers.openLoading();

        // transform data
        this.model.total_actual = 0;
        this.model.total_quantity = 0;
        this.model.total_adjustment = 0;
        this.model.items.map(item => {
            // calculate toatal record
            this.model.total_actual += item.total_actual;
            this.model.total_quantity += item.total_quantity;
            this.model.total_adjustment += item.total_adjustment < 0
                ? 0 - item.total_adjustment
                : item.total_adjustment;
        });

        // submit data
        this.service.create(
            new StockTake(this.model)
        ).then(res => {
            if (res.code) {
                const error = new ErrorModel(res);
                this.toastrService.warning(error.getMessage);
                return false;
            }

            // TODO:: Success
            $('form').trigger('reset');
            this.toastrService.success('Thêm mới thành công!');

            // load default data
            this.model.store = this.stores[0];
            this.model.items = [];
            return true;
        }).catch(ex => {
            throw (ex);
        }).finally(() => {
            this.helpers.closeLoading();
        });
    }
}
