import { Component, ViewEncapsulation, OnInit } from '@angular/core';

// Plugins
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

// Modules
import { Helpers } from 'src/common/utils';
import { ErrorModel, Export, ExportNormalStatuses, ExportStatuses } from 'src/common/models';
import { ExportService } from 'src/common/services';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: '.c-body',
    templateUrl: './detail.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        ExportService
    ]
})

export class DetailExportComponent implements OnInit {
    // Variables
    model: any = {};
    statuses = ExportStatuses;

    constructor(
        private toastrService: ToastrService,
        private service: ExportService,
        private route: ActivatedRoute,
        private helpers: Helpers
    ) { }

    async ngOnInit() {
        await this.service.detail(
            this.route.snapshot.params.id
        ).then(res => {
            if (res.code) {
                const error = new ErrorModel(res);
                this.toastrService.warning(error.getMessage);
                return false;
            }

            // Handle Success
            this.model = res.data;
            this.model.status_name = ExportNormalStatuses[
                this.model.status.toUpperCase()
            ];
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
            this.model.id,
            new Export(this.model)
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
            title: 'Nhập hàng',
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
                    this.model.status_name = ExportNormalStatuses.CONFIRMED;
                    this.model.status = ExportStatuses.CONFIRMED;
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
                    this.model.status_name = ExportNormalStatuses.CANCELLED;
                    this.model.status = ExportStatuses.CANCELLED;
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
