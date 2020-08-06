import {
    Component,
    ViewEncapsulation,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import swal from 'sweetalert2';

@Component({
    selector: 'dunnio-table-data-order-available',
    templateUrl: './table.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: []
})

export class OrderTableDataAvailableComponent {
    constructor() { }

    /** public variable */
    @Input() data;
    @Output() callback = new EventEmitter<object>();

    onChangeQuantity = (itemId: string, quantity: string) => {
        const itemQuantity = parseInt(quantity, 10);
        const item = this.data.products.find(x => x.id === itemId);
        if (!itemQuantity || itemQuantity <= 0) {
            $(event.target).val(item.total_quantity);
        }

        item.total_quantity = !itemQuantity || itemQuantity <= 0 ? 1 : itemQuantity;
        const payment = this.handleEventReloadPrice({
            price: item.price,
            total_quantity: item.total_quantity,
            discount: item.discount,
            promotions: [],
        });
        return Object.assign(item, payment),
            this.callback.emit({
                data: null,
                type: 'handleEventReloadCartPayment'
            });
    }

    handleEventReloadPrice = (payment) => {
        try {
            const {
                price,
                discount,
                promotions = [],
                total_quantity,
            } = payment;

            /** load discount item */
            let priceBeforeDiscount = price;
            if (promotions.length) {
                promotions.map(voucher => {
                    if (priceBeforeDiscount > 0) {
                        priceBeforeDiscount = voucher.discount_type === 1
                            ? (priceBeforeDiscount - (priceBeforeDiscount * voucher.discount) / 100)
                            : priceBeforeDiscount - voucher.discount;
                    }
                });
            }
            if (discount && priceBeforeDiscount > 0) {
                if (discount.discount > 0) {
                    priceBeforeDiscount = discount.discount_type === 1
                        ? (priceBeforeDiscount - (priceBeforeDiscount * discount.discount) / 100)
                        : priceBeforeDiscount - discount.discount;
                }
            }
            priceBeforeDiscount = priceBeforeDiscount > 0 ? priceBeforeDiscount : 0;

            /** load total price */
            const totalPrice = (price * total_quantity);
            const totalPriceDiscount = (priceBeforeDiscount * total_quantity);
            const totalDiscount = totalPrice - totalPriceDiscount;

            return {
                price: price,
                total_price: totalPrice,
                total_price_discount: totalPriceDiscount,
                total_discount: totalDiscount
            };
        } catch (ex) {
            /*begin:: write log ex here: break*/
            throw new Error(ex);
        }
    }

    onRemoveItem = (itemId) => {
        try {
            swal.fire({
                title: 'Thông báo',
                text: 'Bạn chắc chắn rằng mình muốn xóa sản phẩm này không?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Tôi đồng ý!',
                cancelButtonText: 'Từ bỏ!'
            }).then(async (result) => {
                if (result.value) {
                    this.data.products = this.data.products.filter(x => x.id !== itemId);
                    return this.callback.emit({
                        data: null,
                        type: 'handleEventReloadCartPayment'
                    });
                }
            });
        } catch (ex) {
            console.log(ex);
        }

    }

    onUpdateItem = (itemId) => {
        this.callback.emit({
            data: {
                itemId: itemId,
                type: this.data.type
            },
            type: 'onUpdateItem'
        });
    }
}
