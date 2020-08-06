import { Component, ViewEncapsulation, Input, OnInit } from '@angular/core';

// Plugins
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

// Module
import { Helpers } from 'src/common/utils';
import { ErrorModel, Customer } from 'src/common/models';
import { CustomerService, CustomerGroupService } from 'src/common/services';

@Component({
    selector: 'tab-customer-detail',
    templateUrl: './tab-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        CustomerService,
        CustomerGroupService
    ]
})

export class TabCustomerDetailComponent implements OnInit {
    // Variables
    @Input() model: any = {};
    store: any = {};

    // Binding
    sources: any = [];
    relations: any = [];

    constructor(
        private helpers: Helpers,
        private service: CustomerService,
        private toastrService: ToastrService,
        private groupService: CustomerGroupService
    ) { }

    async ngOnInit() {
        try {
            this.helpers.openLoading();

            // load default config
            const config = new Customer();
            this.sources = config.sources;
            this.relations = config.relations;
            this.store = this.model.stores && this.model.stores[0]
                ? this.model.stores[0].name
                : {};
        } catch (ex) {
            throw Error(ex);
        } finally {
            this.helpers.closeLoading();
        }
    }

    /**
     * handler image callback
     * @param {*} image
     */
    handleImageCallback(image) {
        this.model.avatar = image;
    }

    /**
     * Create
     * @param {*} f
     */
    async onEdit() {
        try {
            this.helpers.openLoading();
            const res = await this.service.update(
                this.model.id,
                new Customer(this.model)
            );
            if (res.code) {
                const error = new ErrorModel(res);
                return this.toastrService.warning(error.getMessage);
            }

            // Handle Success
            return this.toastrService.success('Cập nhật thành công!');
        } catch (ex) {
            throw Error(ex);
        } finally {
            this.helpers.closeLoading();
        }
    }

    /**
     * Delete
     */
    onDelete() {
        Swal.fire({
            title: 'Xoá Khách Hàng?',
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
                        return Swal.fire('', error.getMessage, 'warning');
                    }

                    // Handle Success
                    return Swal.fire('', 'Xóa thành công!', 'success');
                } catch (ex) {
                    throw ex;
                } finally {
                    this.helpers.closeLoading();
                }
            }
        });
    }

    /**
     * Block user
     */
    async onBlock() {
        try {
            this.helpers.openLoading();
            const res = await this.service.update(
                this.model.id,
                new Customer({ status: 'inactive' })
            );
            if (res.code) {
                const error = new ErrorModel(res);
                return this.toastrService.warning(error.getMessage);
            }

            // Handle Success
            return this.toastrService.success('Cập nhật thành công!');
        } catch (ex) {
            throw Error(ex);
        } finally {
            this.helpers.closeLoading();
        }
    }
}
