import {
    Component,
    ViewEncapsulation,
    Input,
    OnChanges,
} from '@angular/core';
import swal from 'sweetalert2';

import { ProductService, CategoryService } from 'src/common/services';

@Component({
    selector: 'dunnio-item-available-detail',
    templateUrl: 'detail.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        ProductService,
        CategoryService
    ]
})

export class ItemAvailableDetailComponent implements OnChanges {

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService
    ) { }

    @Input() itemId: string;

    model: any;
    categories: any = [];

    async ngOnChanges() {
        try {
            if (this.itemId) {
                const res = await this.productService.detail(this.itemId);
                if (res.code) return swal.fire('Hệ Thống', 'Sản phẩm không khả dụng', 'warning');
                this.model = res.data;
                const respone = await this.categoryService.list({ skip: 0, limit: 100 } as any);
                this.categories = respone.code ? [] : respone.data;
                this.model.category_name = await this.categories.find(x => x.id === this.model.category_id).name;
            }
        } catch (ex) {
            console.log(ex);
        }
    }
}
