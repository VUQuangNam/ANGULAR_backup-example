import { Component, ViewEncapsulation, OnInit } from '@angular/core';

// Plugins
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

// Modules
import { Helpers } from 'src/common/utils';
import { ErrorModel, Rank } from 'src/common/models';
import { RankService, CustomerService } from 'src/common/services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: '.c-body',
    templateUrl: './detail.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        RankService,
        CustomerService
    ]
})

export class DetailRankComponent implements OnInit {
    // Variables
    model: any = {};
    customers: any = [];

    // $search
    keypress: any;
    loading: boolean;

    constructor(
        private helpers: Helpers,
        private toastrService: ToastrService,
        private customerService: CustomerService,
        private service: RankService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    async ngOnInit() {
        const rankId = this.route.snapshot.params.id;

        // Load detail
        await this.service.detail(
            rankId
        ).then(res => {
            if (res.code) {
                const error = new ErrorModel(res);
                this.toastrService.warning(error.getMessage);
                return null;
            }

            // TODO:: success
            this.model = res.data;
        }).catch(ex => {
            throw Error(ex);
        });

        // Load list customer with rank id
        await this.customerService.list(
            {
                skip: 0,
                limit: 200,
                ranks: rankId
            } as any
        ).then(res => {
            this.customers = res.code ? [] : res.data;
        }).catch(ex => {
            this.customers = [];
            throw Error(ex);
        });

        // Page loaded
        this.helpers.closeLoading();
    }

    /**
     * Search customers
     * @param {*} customers
     */
    handleSeachChange(customers) {
        const selected = [];
        customers.map(x => selected.push(x.id));
        this.model.customers = selected;
    }

    /**
     * Update
     * @param {*} f
     */
    onUpdate() {
        this.helpers.openLoading();
        this.service.update(
            this.model.id,
            new Rank(this.model)
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
            title: 'Xoá Rank?',
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
                    this.toastrService.success('Xóa thành công!');
                    this.router.navigate(['customer-rank']);
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
