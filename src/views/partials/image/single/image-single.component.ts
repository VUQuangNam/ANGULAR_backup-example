import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

// Modules
import { UploadService } from 'src/common/services';
import { ErrorModel } from 'src/common/models';
import { ToastrService } from 'ngx-toastr';
import { Helpers } from 'src/common/utils';

@Component({
    selector: 'app-image-single',
    templateUrl: './image-single.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        UploadService
    ]
})

export class ImageSingleComponent {
    // Inputs
    @Input() image: string;
    @Input() category: string;

    // Configuration
    @Input() width = '140px';
    @Input() height = '120px';
    @Input() button = true;
    @Input() remove = true;


    // Returns
    @Output() callback = new EventEmitter<string>();

    constructor(
        private serivce: UploadService,
        private toastrService: ToastrService,
        private helpers: Helpers
    ) { }

    async onUpload($event) {
        if ($event) {
            this.helpers.openLoading();
            const input = $event.target;
            const formData = new FormData();
            formData.append('file', input.files[0]);
            await this.serivce.single(
                formData,
                this.category
            ).then(res => {
                if (res.code) {
                    const error = new ErrorModel(res);
                    this.toastrService.warning(error.getMessage);
                    return null;
                }
                this.image = res.url;
                return this.callback.emit(this.image);
            }).catch(ex => {
                throw new Error(ex);
            }).finally(() => {
                this.helpers.closeLoading();
            });
        }
    }
}
