import { Component, ViewEncapsulation, OnInit } from '@angular/core';

// Plugins
import { ToastrService } from 'ngx-toastr';

// Modules
import { Helpers, TypesUtilsService } from 'src/common/utils';
import { ErrorModel, StockTake, StockTakeStatuses, StockTakeNormalStatuses } from 'src/common/models';
import { StockTakeService } from 'src/common/services';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: '.c-body',
    templateUrl: './detail.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        StockTakeService
    ]
})

export class DetailStockTakeComponent implements OnInit {
    // Decorations Enums
    public statuses = StockTakeStatuses;

    // Decorations Variables
    public model: any = {};
    public stores: any = [];

    constructor(
        private toastrService: ToastrService,
        private typeService: TypesUtilsService,
        private service: StockTakeService,
        private route: ActivatedRoute,
        private helpers: Helpers
    ) {
        // Load configuration
        this.model.source = {};
    }

    async ngOnInit() {
        this.service.detail(
            this.route.snapshot.params.id
        ).then(res => {
            if (res.code) {
                const error = new ErrorModel(res);
                this.toastrService.warning(error.getMessage);
                return false;
            }

            // Handle Success
            this.model = res.data;
            this.model.created_at = this.typeService.formatDate(
                this.model.created_at,
                'DD/MM/YYYY hh:mm'
            );
            this.model.updated_at = this.typeService.formatDate(
                this.model.updated_at,
                'DD/MM/YYYY hh:mm'
            );
            this.model.confirmed_at = this.model.confirmed_at
                ? this.typeService.formatDate(
                    this.model.confirmed_at,
                    'DD/MM/YYYY hh:mm'
                )
                : null;
            this.model.status_name = StockTakeNormalStatuses[
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
            new StockTake(this.model)
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
            title: 'Cân bằng kho',
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
                    this.model.status_name = StockTakeNormalStatuses.CONFIRMED;
                    this.model.status = StockTakeStatuses.CONFIRMED;
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
                    this.model.status_name = StockTakeNormalStatuses.CANCELLED;
                    this.model.status = StockTakeStatuses.CANCELLED;
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
