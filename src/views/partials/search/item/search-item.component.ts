import { Component, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';

// Modules
import { InventoryService } from 'src/common/services';

@Component({
    selector: 'app-search-item',
    templateUrl: './search-item.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        InventoryService
    ]
})

export class SearchItemComponent {
    // Input
    @Input() items: any = [];
    @Input() storeId: number;
    @Input() quantity: number;
    @Input() isView = false;
    @Output() callback = new EventEmitter<any[]>();

    // $search
    keypress: any;
    loading: boolean;
    searchData: any = [];

    constructor(
        private service: InventoryService
    ) { }

    /**
     * Change quantity
     * @param $event
     */
    onChangeQuantity($event) {
        const id = $event.target.name;
        const value = $event.target.value;
        this.items.map(item => {
            if (item.id === id) {
                item.total_quantity = parseInt(value, 10);
                item.total_price = Math.ceil(item.price * item.total_quantity);
            }
        });
        return this.callback.emit(
            this.items
        );
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
            this.service.list(
                params as any
            ).then(res => {
                if (!res.code) {
                    this.searchData = res.data.map(el => {
                        el.current_quantity = 0;
                        if (el.inventories) {
                            const stock = el.inventories.find(x => x.id === this.storeId);
                            el.current_quantity = stock ? stock.total_quantity : 0;
                        }
                        return el;
                    });
                }
            }).catch(ex => {
                this.items = [];
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
            const data = [...this.items];

            // trasnform data
            item.total_price = 0;
            item.total_quantity = 0;
            data.push(item);
            this.items = data;

            // return data
            return this.callback.emit(
                this.items
            );
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
            const index = this.items.findIndex(
                x => x.id === itemId
            );
            this.items.splice(
                index, 1
            );
            return this.callback.emit(
                this.items
            );
        } catch (ex) {
            throw Error(ex);
        }
    }
}
