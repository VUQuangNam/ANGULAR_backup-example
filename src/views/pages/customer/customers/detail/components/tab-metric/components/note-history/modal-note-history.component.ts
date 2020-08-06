import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Pugins
import { ToastrService } from 'ngx-toastr';

// Modules
import { ModalService, BodyNoteService } from 'src/common/services';
import { ErrorModel } from 'src/common/models';
import { Helpers } from 'src/common/utils';

@Component({
    selector: 'modal-metric-history',
    templateUrl: './modal-note-history.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        BodyNoteService
    ]
})

export class ModalNoteHistoryComponent implements OnInit {
    // Variables
    model: any = {};
    bodyNote: any = {};
    customerId: string;

    constructor(
        private modalService: ModalService,
        private noteService: BodyNoteService,
        private toastrService: ToastrService,
        private helpers: Helpers,
        private router: Router
    ) { }

    ngOnInit() {
        console.log(this.bodyNote);
    }

    onChangeNote(id) {
        this.bodyNote.values.map(x => {
            x.checked = x.id === id ? !x.checked : x.checked;
        });
    }

    /**
     * Create
     * @param {*} model
     */
    async onCreate() {
        this.helpers.openLoading();
        // load remove data
        const removed = this.bodyNote.values
            .filter(x => !x.checked)
            .map(x => x.id);
        await this.noteService.delete({
            noteId: this.bodyNote.id,
            data: { values: removed, customer_id: this.customerId }
        }).then(res => {
            if (res.code) {
                const error = new ErrorModel(res);
                this.toastrService.warning(error.getMessage);
                return false;
            }
        }).catch(ex => {
            throw Error(ex);
        });

        // load added data
        const added = this.bodyNote.values
            .filter(x => x.checked)
            .map(x => x.id);
        await this.noteService.create({
            values: added,
            key: this.bodyNote.id,
            customer_id: this.customerId
        }).then(res => {
            if (res.code) {
                const error = new ErrorModel(res);
                this.toastrService.warning(error.getMessage);
                return false;
            }

            // Handle Success
            this.toastrService.success('Thêm mới thành công!');
            return true;
        }).catch(ex => {
            throw Error(ex);
        }).finally(() => {
            this.helpers.closeLoading();
        });
    }

    /**
     * Close
     * @private
     */
    onClose() {
        this.modalService.close(
            ModalNoteHistoryComponent
        );
    }
}
