import { Component, ViewEncapsulation, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

// Plugins
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

// Modules
import { Helpers } from 'src/common/utils';
import { ErrorModel, Material } from 'src/common/models';
import { MaterialService, ProductTypeService, PriceBookService, ModalService } from 'src/common/services';
import { BaseConfig } from 'src/config';

@Component({
    selector: 'modal-edit-material',
    templateUrl: './detail.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        PriceBookService,
        ProductTypeService,
        MaterialService
    ]
})

export class DetailMaterialComponent implements OnInit {
    // Events
    @Output() callback = new EventEmitter<Material>();

    // Variables
    model: any = {};
    materialId: string;
    units: any = [];
    types: any = [];
    prices: any = [];
    queryParams: any = {};

    constructor(
        private baseConfig: BaseConfig,
        private modalService: ModalService,
        private toastrService: ToastrService,
        private priceBookService: PriceBookService,
        private typeService: ProductTypeService,
        private service: MaterialService,
        private helpers: Helpers,
        private router: Router
    ) { }

    async ngOnInit() {

        // Load unit from local
        this.units = this.baseConfig.unitConfig;

        // Load product types
        let respone = await this.typeService.list({ skip: 0, limit: 100 } as any);
        this.types = respone.code ? [] : respone.data;

        // Load product price-books
        respone = await this.priceBookService.list({ skip: 0, limit: 100 } as any);
        this.prices = respone.code ? [] : respone.data;

        respone = await this.service.detail(this.materialId);
        if (respone.code) {
            const error = new ErrorModel(respone);
            this.toastrService.warning(error.getMessage);
            return false;
        }

        // Handle Success
        this.model = respone.data;
        this.model.avatar = this.model.images[0] || null;
        this.model.unit = this.model.properties.unit
            ? this.model.properties.unit
            : this.units[0].name;
        this.model.type = this.model.type
            ? this.model.type
            : this.types[0].id;
        this.model.price_book = this.model.price_books[0]
            ? this.model.price_books[0].id
            : this.prices[0].id;
    }

    /**
     * Handle call back
     * @param {*} image
     */
    handleImageCallback = (image) => this.model.images = [image];

    /**
     * Update
     * @param {*} f
     */
    onUpdate() {
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

        // submit
        this.service.update(
            this.materialId,
            new Material(this.model)
        ).then(res => {
            if (res.code) {
                const error = new ErrorModel(res);
                this.toastrService.warning(error.getMessage);
                return false;
            }

            // TODO:: Success
            this.toastrService.success('Cập nhật thành công!');
            this.callback.emit(res.data);
            return true;
        }).catch(ex => {
            throw (ex);
        }).finally(() => {
            this.helpers.closeLoading();
        });
    }


    /**
     * Delete
     */
    onDelete() {
        Swal.fire({
            title: 'Xoá Nguyên Phụ Liệu?',
            text: 'Bạn có chắc chắn mình muốn thực hiện thao tác này!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý!',
            cancelButtonText: 'Hủy bỏ'
        }).then(async (result) => {
            if (result.value) {
                this.helpers.openLoading();
                try {
                    const res = await this.service.delete(
                        this.model.id
                    );
                    if (res.code) {
                        const error = new ErrorModel(res);
                        this.toastrService.warning(error.getMessage);
                        return false;
                    }

                    // Handle Success
                    this.toastrService.success('Xóa thành công!');
                    this.onClose();
                    return true;
                } catch (ex) {
                    throw ex;
                } finally {
                    this.helpers.closeLoading();
                }
            }
        });
    }

    /**
     * Close modal
     * @private
     */
    onClose = () => {
        this.modalService.close(DetailMaterialComponent);
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
