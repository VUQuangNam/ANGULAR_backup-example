import {
    Component,
    ViewEncapsulation,
    Input,
    Output,
    EventEmitter,
    OnChanges
} from '@angular/core';

import { Storage } from 'src/common/models';

@Component({
    selector: 'dunnio-header-order-uniform',
    templateUrl: './header.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: []
})

export class OrderHeaderUniformComponent implements OnChanges {
    constructor(
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
    serviceStores: any = [];
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
}
