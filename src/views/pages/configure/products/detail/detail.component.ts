import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ProductService, CategoryService } from 'src/common/services';

// Plugins
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

// Modules
import { Helpers } from 'src/common/utils';
import { BaseConfig } from 'src/config';
import { Product, ErrorModel, ProductTypes } from 'src/common/models';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: '.c-body',
    templateUrl: './detail.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        ProductService,
        CategoryService
    ]
})

export class DetailProductComponent implements OnInit {
    // Variables
    model: any = {};

    // configs
    units: any = [];
    categories: any = [];

    constructor(
        private service: ProductService,
        private categoryService: CategoryService,
        private toastrService: ToastrService,
        private baseConfig: BaseConfig,
        private route: ActivatedRoute,
        private helpers: Helpers,
    ) {
        // load default data before render
        this.model = { images: [], fabric: {}, metadata: {}, properties: {}, category_id: null };
    }

    async ngOnInit() {
        try {
            const productId = this.route.snapshot.params.id;

            // Load configuraion
            this.units = this.baseConfig.unitConfig;

            // Load categories
            const categoryFilters = { skip: 0, limit: 100 } as any;
            let respone = await this.categoryService.list(categoryFilters);
            this.categories = respone.code ? [] : respone.data;

            // Load product detail
            respone = await this.service.detail(productId);
            if (respone.code) {
                const error = new ErrorModel(respone);
                this.toastrService.warning(error.getMessage);
                return null;
            }

            // handle success
            this.model = respone.data;
        } catch (ex) {
            throw Error(ex);
        } finally {
            this.helpers.closeLoading();
        }
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
     * Update
     * @param {*} model
     */
    onUpdate() {
        this.helpers.openLoading();

        // transform data
        this.model.type = ProductTypes.AVAILABLE;
        this.model.metadata = Object.keys(this.model.metadata).length ? this.model.metadata : null;
        this.model.properties = Object.keys(this.model.properties).length ? this.model.properties : null;
        this.model.images = this.model.images.filter(x => x !== null);

        // submit data
        this.service.update(
            this.model.id,
            new Product(this.model)
        ).then(res => {
            if (res.code) {
                const error = new ErrorModel(res);
                this.toastrService.warning(error.getMessage);
                return false;
            }

            // TODO:: Success
            this.toastrService.success('Cập nhật thành công!');
            return true;
        }).catch(ex => {
            throw (ex);
        }).finally(() => {
            this.helpers.closeLoading();
        });
    }
}
