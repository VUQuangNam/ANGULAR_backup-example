// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Plugins
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ToastrModule } from 'ngx-toastr';

// Service and config
import { FilterConfig } from 'src/config';
import { ServiceClient } from 'src/common/services';
import { Helpers, HttpUtilsService, TypesUtilsService } from 'src/common/utils';

// Base Component
import { FormComponent } from './form/form.component';
import { TableComponent } from './table/table.component';
import { PaginationComponent } from './page/page.component';
import { FilterComponent } from './filter/option/filter-option.component';
import { DateFilterComponent } from './filter/date/date-filter.component';
import { ImageSingleComponent } from './image/single/image-single.component';
import { ImageMultipleComponent } from './image/multiple/image-multiple.component';
import { SearchUserComponent } from './search/user/search-user.component';
import { SearchItemComponent } from './search/item/search-item.component';
import { DesignStyleComponent } from './design/style/design-style.component';


@NgModule({
    declarations: [
        FormComponent,
        TableComponent,

        // Filter
        FilterComponent,
        DateFilterComponent,
        PaginationComponent,

        // Image
        ImageSingleComponent,
        ImageMultipleComponent,

        // Search
        SearchUserComponent,
        SearchItemComponent,

        // Design
        DesignStyleComponent
    ],
    exports: [
        FormComponent,
        TableComponent,

        // Filter
        FilterComponent,
        DateFilterComponent,
        PaginationComponent,

        // Image
        ImageSingleComponent,
        ImageMultipleComponent,

        // Search
        SearchUserComponent,
        SearchItemComponent,

        // Design
        DesignStyleComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,

        // Plugins
        NgSelectModule,
        NgxDatatableModule,
        ToastrModule.forRoot(),
        PopoverModule.forRoot(),
        BsDatepickerModule.forRoot()
    ],
    providers: [
        // Utilities
        Helpers,
        HttpUtilsService,
        TypesUtilsService,

        // Configs
        FilterConfig,

        // Services
        ServiceClient
    ]
})
export class PartialsModule {
}
