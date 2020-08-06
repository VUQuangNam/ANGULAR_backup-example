import { Component, ViewEncapsulation, OnInit, Output, EventEmitter, Input } from '@angular/core';

// Plugins
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

// Modules
import { Helpers } from 'src/common/utils';
import { ErrorModel, Store } from 'src/common/models';
import { StoreService, ModalService } from 'src/common/services';
import { Router } from '@angular/router';

@Component({
    selector: 'modal-edit-store',
    templateUrl: './detail.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        StoreService
    ]
})

export class DetailStoreComponent implements OnInit {
    // Inputs
    @Output() callback = new EventEmitter<Store>();

    // Variables
    model: any = {};
    storeId: string;
    queryParams: any = {};

    constructor(
        private modalService: ModalService,
        private toastrService: ToastrService,
        private service: StoreService,
        private helpers: Helpers,
        private router: Router
    ) { }

    async ngOnInit() {
        await this.service.detail(
            this.storeId
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
        }).finally(() => {
            this.helpers.closeLoading();
        });
    }

    /**
     * Update
     * @param {*} f
     */
    onUpdate() {
        this.helpers.openLoading();
        this.service.update(
            this.storeId,
            new Store(this.model)
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
            title: 'Xoá Chi Nhánh?',
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
        this.modalService.close(DetailStoreComponent);
        const params = Object.assign(
            this.queryParams,
            { ref: Date.now() }
        );
        return this.router.navigate(
            ['setting/stores'],
            { queryParams: params }
        );
    }
}
