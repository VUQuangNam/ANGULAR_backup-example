import {
    Component,
    ViewEncapsulation,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import swal from 'sweetalert2';

@Component({
    selector: 'dunnio-table-data-order-tailor',
    templateUrl: './table-data.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: []
})

export class OrderTableDataTailorComponent {
    constructor() { }

    /** public variable */
    @Input() data;
    @Output() callback = new EventEmitter<object>();

    /** variable */
    promotions: any = [];
    keypress: any;

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
                    this.callback.emit({
                        data: null,
                        type: 'removeItem'
                    });
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

    openModalCreateOrderTailor = () => {
        try {
            if (!this.data.customer) {
                return swal.fire('Hệ Thống', 'Vui lòng chọn khách hàng.!', 'warning');
            }
            ($('#dunnio_create_item') as any).modal('show');
        } catch (ex) {
            console.log(ex);
        }
    }
}
