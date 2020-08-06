import { Component, ViewEncapsulation, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

// Plugins
import { ToastrService } from 'ngx-toastr';

// Modules
import { Helpers } from 'src/common/utils';
import { ErrorModel, PriceBook } from 'src/common/models';
import { PriceBookService, ModalService, CategoryService } from 'src/common/services';

@Component({
    selector: 'modal-add-price',
    templateUrl: './create.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        PriceBookService,
        CategoryService
    ]
})

export class CreatePriceBookComponent implements OnInit {
    // Events
    @Output() callback = new EventEmitter<PriceBook>();

    // Variables
    model: any = {};
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
        try {
            // load category
            const respone = await this.categoryService.list({ skip: 0, limit: 100 } as any);
            this.categories = respone.code ? [] : respone.data;
            this.model.categories = this.categories.map(x => {
                return {
                    id: x.id,
                    name: x.name,
                    price: 0
                };
            });
        } catch (ex) {
            throw Error(ex);
        } finally {
            this.helpers.closeLoading();
        }
    }

    /**
     * Create
     * @param {*} f
     */
    onCreate() {
        this.helpers.openLoading();
        this.service.create(
            new PriceBook(this.model)
        ).then(res => {
            if (res.code) {
                const error = new ErrorModel(res);
                this.toastrService.warning(error.getMessage);
                return false;
            }

            // TODO:: Success
            $('form').trigger('reset');
            this.toastrService.success('Thêm mới thành công!');
            this.callback.emit(res.data);
            return true;
        }).catch(ex => {
            throw (ex);
        }).finally(() => {
            this.helpers.closeLoading();
        });
    }

    /**
     * Close modal
     * @private
     */
    onClose = () => {
        this.modalService.close(CreatePriceBookComponent);
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
