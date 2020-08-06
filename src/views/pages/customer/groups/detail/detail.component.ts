import { Component, ViewEncapsulation, OnInit } from '@angular/core';

// Plugins
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

// Modules
import { Helpers } from 'src/common/utils';
import { ErrorModel, CustomerGroup, Storage } from 'src/common/models';
import { CustomerGroupService } from 'src/common/services';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: '.c-body',
    templateUrl: './detail.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        CustomerGroupService
    ]
})

export class DetailCustomerGroupComponent implements OnInit {
    // Variables
    model: any = {};
    stores: any = [];

    // $search
    keypress: any;
    loading: boolean;

    constructor(
        private helpers: Helpers,
        private toastrService: ToastrService,
        private service: CustomerGroupService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    async ngOnInit() {
        try {
            const groupId = this.route.snapshot.params.id;
            const respone = await this.service.detail(groupId);
            if (respone.code) {
                const error = new ErrorModel(respone);
                this.toastrService.warning(error.getMessage);
                return null;
            }

            // TODO:: success
            this.model = respone.data;
            console.log(this.model);
        } catch (ex) {
            throw Error(ex);
        } finally {
            this.helpers.closeLoading();
        }
    }

    /**
     * Search customers
     * @param {*} customers
     */
    handleSeachChange(customers) {
        this.model.customers = [...customers];
    }

    /**
     * Update
     * @param {*} f
     */
    onUpdate() {
        this.helpers.openLoading();
        this.service.update(
            this.model.id,
            new CustomerGroup(this.model)
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

    /**
     * Remove
     * @param {*} id
     */
    onRemove() {
        Swal.fire({
            title: 'Xoá Nhóm Khách Hàng?',
            text: 'Bạn có chắc chắn mình muốn thực hiện thao tác này!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý!',
            cancelButtonText: 'Hủy bỏ'
        }).then(async (result) => {
            if (result.value) {
                this.helpers.openLoading();
                this.service.delete(
                    this.model.id
                ).then(res => {
                    if (res.code) {
                        const error = new ErrorModel(res);
                        this.toastrService.warning(error.getMessage);
                        return false;
                    }

                    // TODO:: Success
                    $('form').trigger('reset');
                    this.toastrService.success('Xóa thành công!');
                    this.router.navigate(['customer-group']);
                    return true;
                }).catch(ex => {
                    throw (ex);
                }).finally(() => {
                    this.helpers.closeLoading();
                });
            }
        });
    }
}
