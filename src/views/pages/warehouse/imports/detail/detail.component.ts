import { Component, ViewEncapsulation, OnInit } from '@angular/core';

// Plugins
import { ToastrService } from 'ngx-toastr';

// Modules
import { Helpers } from 'src/common/utils';
import { ErrorModel, Import, ImportStatuses, ImportNormalStatuses } from 'src/common/models';
import { ImportService } from 'src/common/services';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: '.c-body',
    templateUrl: './detail.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        ImportService
    ]
})

export class DetailImportComponent implements OnInit {
    // Decorations Enums
    public statuses = ImportStatuses;

    // Decorations Variables
    public model: any = {};
    public stores: any = [];

    constructor(
        private toastrService: ToastrService,
        private service: ImportService,
        private helpers: Helpers,
        private route: ActivatedRoute
    ) {
        // Load configuration
        this.model.source = {};
    }

    async ngOnInit() {
        const importId = this.route.snapshot.params.id;
        this.service.detail(
            importId
        ).then(res => {
            if (res.code) {
                const error = new ErrorModel(res);
                this.toastrService.warning(error.getMessage);
                return false;
            }

            // Handle Success
            this.model = res.data;
            this.model.status_name = ImportNormalStatuses[
                this.model.status.toUpperCase()
            ];
        }).catch(ex => {
            console.log(ex);
            throw Error(ex);
        }).finally(() => {
            // final page load
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
            this.model.id,
            new Import(this.model)
        ).then(res => {
            if (res.code) {
                const error = new ErrorModel(res);
                this.toastrService.warning(error.getMessage);
                return false;
            }

            // Handle Success
            this.toastrService.success('Cập nhật thành công!');
            return true;
        }).catch(ex => {
            throw (ex);
        }).finally(() => {
            this.helpers.closeLoading();
        });
    }

    /**
     * Confirm
     * @param {*} status
     */
    onConfirm() {
        Swal.fire({
            title: 'Nhập Hàng',
            text: 'Bạn có chắc chắn mình muốn thực hiện thao tác này!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý!',
            cancelButtonText: 'Hủy bỏ'
        }).then(async (result) => {
            if (result.value) {
                this.helpers.openLoading();
                try {
                    const res = await this.service.confirm(
                        this.model.id
                    );
                    if (res.code) {
                        const error = new ErrorModel(res);
                        this.toastrService.warning(error.getMessage);
                        return false;
                    }

                    // Handle Success
                    this.toastrService.success('Nhập hàng thành công!');
                    this.model.status_name = ImportNormalStatuses.CONFIRMED;
                    this.model.status = ImportStatuses.CONFIRMED;
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
     * Cancel
     * @param {*} status
     */
    onCancel() {
        Swal.fire({
            title: 'Hủy Phiếu',
            text: 'Bạn có chắc chắn mình muốn thực hiện thao tác này!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý!',
            cancelButtonText: 'Hủy bỏ'
        }).then(async (result) => {
            if (result.value) {
                this.helpers.openLoading();
                try {
                    const res = await this.service.cancel(
                        this.model.id,
                        this.model.reason
                    );
                    if (res.code) {
                        const error = new ErrorModel(res);
                        this.toastrService.warning(error.getMessage);
                        return false;
                    }

                    // Handle Success
                    this.toastrService.success('Hủy phiếu thành công!');
                    this.model.status_name = ImportNormalStatuses.CANCELLED;
                    this.model.status = ImportStatuses.CANCELLED;
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
     * Print
     * @private
     */
    onPrint() {
        alert('Chức năng đang trong quá trình hoàn thiện mẫu in!');
    }
}
