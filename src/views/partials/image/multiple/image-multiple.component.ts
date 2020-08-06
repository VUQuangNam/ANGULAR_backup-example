import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

// Modules
import { UploadService } from 'src/common/services';
import { ErrorModel } from 'src/common/models';
import { Helpers } from 'src/common/utils';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-image-multiple',
    templateUrl: './image-multiple.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        UploadService
    ]
})

export class ImageMultipleComponent {
    // Inputs
    @Input() images: [any];
    @Input() category: string;
    @Output() callback = new EventEmitter<[string]>();

    constructor(
        private helper: Helpers,
        private serivce: UploadService,
        private toastrService: ToastrService
    ) { }

    /**
     * Upload multiple
     * @param {File[]} $event
     */
    async onUploads($event) {
        if ($event) {
            this.helper.openLoading();
            const input = $event.target;

            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < input.files.length; i++) {
                console.log(i);
                const file = input.files[i];
                const formData = new FormData();
                formData.append('file', file);
                await this.serivce.single(
                    formData,
                    this.category
                ).then(res => {
                    if (res.code) {
                        const error = new ErrorModel(res);
                        this.toastrService.warning(error.getMessage);
                        return false;
                    }
                    this.images.push({
                        type: 'image',
                        content: res.data
                    });
                    return true;
                }).catch(ex => {
                    throw new Error(ex);
                });
            }

            // callback
            this.helper.closeLoading();
            return this.callback.emit(this.images);
        }
    }

    /**
     * Remove image
     * @param {number} $event
     */
    onRemoveImage($index) {
        this.images.splice($index);
        return this.callback.emit(this.images);
    }
}
