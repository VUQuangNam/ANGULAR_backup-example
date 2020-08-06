import { Component, ViewEncapsulation, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

// Plugins
import { ToastrService } from 'ngx-toastr';

// Modules
import { Helpers } from 'src/common/utils';
import { ErrorModel, ProductType } from 'src/common/models';
import { ProductTypeService, ModalService } from 'src/common/services';
import Swal from 'sweetalert2';

@Component({
    selector: 'modal-edit-price',
    templateUrl: './detail.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        ProductTypeService
    ]
})

export class DetailProductTypeComponent implements OnInit {
    // Events
    @Output() callback = new EventEmitter<ProductType>();

    // Variables
    model: any = {};
    typeId: string;
    categories: any = [];
    queryParams: any = {};

    constructor(
        private modalService: ModalService,
        private toastrService: ToastrService,
        private service: ProductTypeService,
        private helpers: Helpers,
        private router: Router
    ) { }

    async ngOnInit() {
        await this.service.detail(
            this.typeId
        ).then(res => {
            if (res.code) {
                const error = new ErrorModel(res);
                this.toastrService.warning(error.getMessage);
                return false;
            }

            // TODO:: Success
            this.model = res.data;
        }).catch(ex => {
            throw Error(ex);
        });
    }

    /**
     * Update
     * @param {*} f
     */
    onUpdate() {
        this.helpers.openLoading();
        this.service.update(
            this.typeId,
            new ProductType(this.model)
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
            title: 'Xoá Loại Nguyên Phụ Liệu?',
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
        this.modalService.close(DetailProductTypeComponent);
        const params = Object.assign(
            this.queryParams,
            { ref: Date.now() }
        );
        return this.router.navigate(
            ['setting/product-types'],
            { queryParams: params }
        );
    }
}
