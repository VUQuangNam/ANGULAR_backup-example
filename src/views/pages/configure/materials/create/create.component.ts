import { Component, ViewEncapsulation, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

// Plugins
import { ToastrService } from 'ngx-toastr';

// Modules
import { BaseConfig } from 'src/config';
import { Helpers } from 'src/common/utils';
import { ErrorModel, Material } from 'src/common/models';
import { MaterialService, ProductTypeService, PriceBookService, ModalService } from 'src/common/services';

@Component({
    selector: 'modal-add-material',
    templateUrl: './create.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        MaterialService,
        PriceBookService,
        ProductTypeService
    ]
})

export class CreateMaterialComponent implements OnInit {
    // Events
    @Output() callback = new EventEmitter<Material>();

    // Variables
    model: any = {};
    units: any = [];
    types: any = [];
    prices: any = [];
    queryParams: any = {};

    constructor(
        private modalService: ModalService,
        private toastrService: ToastrService,
        private priceBookService: PriceBookService,
        private typeService: ProductTypeService,
        private service: MaterialService,
        private baseConfig: BaseConfig,
        private helpers: Helpers,
        private router: Router
    ) { }

    async ngOnInit() {
        try {
            this.helpers.openLoading();
            console.log(this.queryParams);

            // Load unit from local
            this.units = this.baseConfig.unitConfig;

            // Load product types
            let respone = await this.typeService.list({ skip: 0, limit: 100 } as any);
            this.types = respone.code ? [] : respone.data;

            // Load product price-books
            respone = await this.priceBookService.list({ skip: 0, limit: 100 } as any);
            this.prices = respone.code ? [] : respone.data;

            // // Load defaul value
            // this.model.unit = this.units && this.units.length
            //     ? this.units[0].name
            //     : null;
            // this.model.type = this.types && this.types.length
            //     ? this.types[0].id
            //     : null;
            // this.model.price_book = this.prices && this.prices.length
            //     ? this.prices[0].id
            //     : null;
        } catch (ex) {
            throw Error(ex);
        } finally {
            this.helpers.closeLoading();
        }
    }

    /**
     * Handle call back
     * @param {*} image
     */
    handleImageCallback = (image) => this.model.images = [image];

    /**
     * Create
     * @param {*} model
     */
    onCreate() {
        this.helpers.openLoading();

        // transform data
        const priceBook = this.prices.find(
            x => x.id === this.model.price_book
        );
        this.model.price_books = priceBook
            ? [priceBook.id]
            : null;
        this.model.price_groups = priceBook
            ? priceBook.categories.map(x => x.id)
            : null;
        this.model.properties = {
            unit: this.model.unit,
            brand: null,
            gender: null
        };

        // submit data
        this.service.create(
            new Material(this.model)
        ).then(res => {
            if (res.code) {
                const error = new ErrorModel(res);
                this.toastrService.warning(error.getMessage);
                return false;
            }

            // TODO:: Success
            $('form').trigger('reset');
            this.toastrService.success('Thêm mới thành công!');
            this.callback.emit(res.data);
            return true;
        }).catch(ex => {
            throw (ex);
        }).finally(() => {
            this.helpers.closeLoading();
        });
    }

    /**
     * Close modal
     * @private
     */
    onClose = () => {
        this.modalService.close(CreateMaterialComponent);
        const params = Object.assign(
            this.queryParams,
            { ref: Date.now() }
        );
        return this.router.navigate(
            ['setting/materials'],
            { queryParams: params }
        );
    }
}
