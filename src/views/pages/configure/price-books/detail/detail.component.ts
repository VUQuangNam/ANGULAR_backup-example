import { Component, ViewEncapsulation, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

// Plugins
import { ToastrService } from 'ngx-toastr';

// Modules
import { Helpers } from 'src/common/utils';
import { ErrorModel, PriceBook } from 'src/common/models';
import { PriceBookService, ModalService, CategoryService } from 'src/common/services';
import Swal from 'sweetalert2';

@Component({
    selector: 'modal-edit-price',
    templateUrl: './detail.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        PriceBookService,
        CategoryService
    ]
})

export class DetailPriceBookComponent implements OnInit {
    // Events
    @Output() callback = new EventEmitter<PriceBook>();

    // Variables
    model: any = {};
    priceId: string;
    categories: any = [];
    queryParams: any = {};

    constructor(
        private modalService: ModalService,
        private toastrService: ToastrService,
        private categoryService: CategoryService,
        private service: PriceBookService,
        private helpers: Helpers,
        private router: Router
    ) { }

    async ngOnInit() {
        await this.service.detail(
            this.priceId
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

        // Load categories
        await this.categoryService.list(
            {
                skip: 0,
                limit: 100
            } as any
        ).then(res => {
            if (!res.code) {
                this.model.categories = res.data.map(el => {
                    const index = this.model.categories.findIndex(
                        x => x.id === el.id
                    );
                    return {
                        id: el.id,
                        name: el.name,
                        price: index !== -1
                            ? this.model.categories[index].price
                            : 0
                    };
                });
                console.log(this.model.categories);
            }

            return null;
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
            this.priceId,
            new PriceBook(this.model)
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
            title: 'Xoá Loại Chất?',
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
        this.modalService.close(DetailPriceBookComponent);
        const params = Object.assign(
            this.queryParams,
            { ref: Date.now() }
        );
        return this.router.navigate(
            ['setting/price-books'],
            { queryParams: params }
        );
    }
}
