import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ProductService, CategoryService } from 'src/common/services';

// Plugins
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

// Modules
import { Helpers } from 'src/common/utils';
import { BaseConfig } from 'src/config';
import { Product, ErrorModel, ProductTypes } from 'src/common/models';

@Component({
    selector: '.c-body',
    templateUrl: './create.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        ProductService,
        CategoryService
    ]
})

export class CreateProductComponent implements OnInit {
    // Variables
    model: any = {};

    // filters
    loading: boolean;
    products: any = [];

    // configs
    units: any = [];
    categories: any = [];

    constructor(
        private service: ProductService,
        private categoryService: CategoryService,
        private toastrService: ToastrService,
        private baseConfig: BaseConfig,
        private helpers: Helpers
    ) {
        // load default data before render
        this.model = { images: [], fabric: {}, metadata: {}, properties: {}, category_id: null };
    }

    async ngOnInit() {
        try {
            // Load configuraion
            this.units = this.baseConfig.unitConfig;

            const categoryFilters = { skip: 0, limit: 100 } as any;
            const respone = await this.categoryService.list(categoryFilters);
            this.categories = respone.code ? [] : respone.data;

            // load default value
            this.handleEventReloadModel();
        } catch (ex) {
            throw Error(ex);
        } finally {
            this.helpers.closeLoading();
        }
    }

    /**
     * Create
     * @param {*} model
     */
    onCreate() {
        this.helpers.openLoading();

        // transform data
        this.model.type = ProductTypes.AVAILABLE;
        this.model.metadata = Object.keys(this.model.metadata).length ? this.model.metadata : null;
        this.model.properties = Object.keys(this.model.properties).length ? this.model.properties : null;
        this.model.images = this.model.images.filter(x => x !== null);

        // submit
        this.service.create(
            new Product(this.model)
        ).then(res => {
            if (res.code) {
                const error = new ErrorModel(res);
                this.toastrService.warning(error.getMessage);
                return false;
            }

            // TODO:: Success
            this.handleEventReloadModel();
            this.toastrService.success('Thêm mới thành công!');
            return true;
        }).catch(ex => {
            throw (ex);
        }).finally(() => {
            this.helpers.closeLoading();
        });
    }

    /**
     * Reload model
     * @private
     */
    onReset() {
        Swal.fire({
            title: 'Làm Mới Dữ Liệu?',
            text: 'Bạn có chắc chắn mình muốn thực hiện thao tác này!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý!',
            cancelButtonText: 'Hủy bỏ'
        }).then(async (result) => {
            if (result.value) this.handleEventReloadModel();
        });
    }

    /**
     * Handle fabric image callback
     * @private
     */
    handleFabricImageCallback = (image) => this.model.fabric.image = image;

    /**
     * Handle product image callback
     * @private
     */
    handleImageCallback = (image, index) => this.model.images[index] = image;

    /**
     * Handle re-load model
     * @private
     */
    handleEventReloadModel() {
        this.model = {
            ...new Object(),
            images: [null, null, null, null],
            fabric: { id: null, name: null, image: null, content: null },
            metadata: { og_title: null, og_url: null, og_description: null },
            properties: { gender: 'male', brand: 'dunnio', unit: this.units[0].name },
            category_id: this.categories[0].id
        };
    }
}
