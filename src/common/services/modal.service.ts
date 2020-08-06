import { Injectable, Component } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';

@Injectable()
export class ModalService {
    private modals: any[] = [];

    constructor(
        private modalService: BsModalService,
    ) { }

    /**
     * Show modal
     * @param component
     * @param options
     */
    open(component: any, options) {
        // Check modal exist
        const modal = this.modals.find(
            x => x.component === component
        );
        if (modal) {
            // remove modal from array of active modals
            this.modals = this.modals.filter(
                x => x.component !== component
            );
        }

        // Add modal
        const modalRef = this.modalService.show(
            component,
            options
        );
        this.modals.push({
            component: component,
            modalRef: modalRef
        });
    }

    close(component: any) {
        // Close modal
        const modal = this.modals.find(x => x.component === component);
        modal.modalRef.hide();

        // remove modal from array of active modals
        this.modals = this.modals.filter(
            x => x.component !== component
        );
    }
}
