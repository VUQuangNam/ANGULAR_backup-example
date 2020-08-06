import {
    Component,
    ViewEncapsulation,
    Input,
    Output,
    EventEmitter,
    OnChanges
} from '@angular/core';

import { ProductService } from 'src/common/services';
import { Storage } from 'src/common/models';

@Component({
    selector: 'dunnio-header-order-available',
    templateUrl: './header.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        ProductService
    ]
})

export class OrderHeaderAvailableComponent implements OnChanges {
    constructor(
        private productService: ProductService,
    ) {
        /** load store follow user */
        this.userStores = JSON.parse(
            localStorage.getItem(
                Storage.STORES
            )
        );
    }

    /** public variable */
    @Input() data;
    @Input() cart;
    @Input() loading;
    @Output() callback = new EventEmitter<object>();

    /** variable */
    products: any = [];
    userStores = [];
    keypress: any;
    carts: any;

    ngOnChanges() {
        this.carts = [...this.cart];
    }

    generateCart = () => {
        this.callback.emit({
            data: null,
            type: 'generateCart'
        });
    }

    onRemoveCart = (orderID) => {
        this.callback.emit({
            data: orderID,
            type: 'onRemoveCart'
        });
    }

    onChangeTab = (orderID) => {
        this.callback.emit({
            data: orderID,
            type: 'onChangeTab'
        });
    }

    onSearchItemAvailable = (keyword: string) => {
        this.loading = true;
        clearTimeout(this.keypress);
        this.keypress = setTimeout(async () => {
            try {
                if (!keyword) return;
                const respone = await this.productService.list({
                    skip: 0,
                    limit: 100,
                    name: keyword,
                    id: keyword,
                    types: 'available'
                });

                const data = respone.code ? [] : respone.data;
                this.products = data.map(x => {
                    return {
                        id: x.id,
                        name: x.name,
                        type: x.type,
                        fullText: x.id + ' ' + x.name,
                        total_quantity: x.inventories.length
                            ? x.inventories[0].total_quantity
                            : 0
                    };
                });

                return this.products;
            } catch (ex) {
                return this.products = this.products || [];
            } finally {
                this.loading = false;
            }
        }, 500);
    }

    onAddItemAvailable = async (item) => {
        this.callback.emit({
            data: {
                item: item,
                name: this.data.name
            },
            type: 'onAddItemAvailable'
        });
    }
}
