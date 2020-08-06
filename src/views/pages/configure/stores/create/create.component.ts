import { Component, ViewEncapsulation, OnInit, Output, EventEmitter } from '@angular/core';

// Plugins
import { ToastrService } from 'ngx-toastr';

// Modules
import { Helpers } from 'src/common/utils';
import { ErrorModel, Store } from 'src/common/models';
import { StoreService, ModalService } from 'src/common/services';
import { Router } from '@angular/router';

@Component({
    selector: 'modal-add-store',
    templateUrl: './create.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        StoreService
    ]
})

export class CreateStoreComponent {
    // Events
    @Output() callback = new EventEmitter<Store>();

    // Variables
    model: any = {};
    queryParams: any = {};

    constructor(
        private modalService: ModalService,
        private toastrService: ToastrService,
        private service: StoreService,
        private helpers: Helpers,
        private router: Router
    ) { }

    /**
     * Create customer
     * @param {*} f
     */
    onCreate() {
        this.helpers.openLoading();
        this.service.create(
            new Store(this.model)
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
        this.modalService.close(CreateStoreComponent);
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
