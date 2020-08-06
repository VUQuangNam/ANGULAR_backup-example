import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Plugins
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CKEditorModule } from 'ckeditor4-angular';
import { NgxCurrencyModule } from 'ngx-currency';

// Modules
import { FilterConfig, BaseConfig, DesignConfig } from 'src/config';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { PartialsModule } from './partials/partials.module';
import { ServiceClient, ModalService } from 'src/common/services';
import { Helpers, HttpUtilsService, TypesUtilsService } from 'src/common/utils';

// Components
import { LayoutComponent } from './themes/layout-1/layout-1.component';
import { Layout2Component } from './themes/layout-2/layout-2.component';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';
import { DashboardComponent } from './pages/dashbroad/dashboard.component';

import { CustomerComponent } from './pages/customer/customers/customer.component';
import { CreateCustomerComponent } from './pages/customer/customers/create/create.component';
import { DetailCustomerComponent } from './pages/customer/customers/detail/detail.component';
import { TabCustomerDetailComponent } from './pages/customer/customers/detail/components/tab-detail/tab-detail.component';
import { TabCustomerMetricComponent } from './pages/customer/customers/detail/components/tab-metric/tab-metric.component';
import { TabCustomerOrderComponent } from './pages/customer/customers/detail/components/tab-order/tab-order.component';
import {
    ModalMetricHistoryComponent
} from './pages/customer/customers/detail/components/tab-metric/components/metric-history/modal-metric-history.component';
import {
    ModalNoteHistoryComponent
} from './pages/customer/customers/detail/components/tab-metric/components/note-history/modal-note-history.component';


import { CustomerGroupComponent } from './pages/customer/groups/group.component';
import { CreateCustomerGroupComponent } from './pages/customer/groups/create/create.component';
import { DetailCustomerGroupComponent } from './pages/customer/groups/detail/detail.component';

import { RankComponent } from './pages/customer/ranks/rank.component';
import { CreateRankComponent } from './pages/customer/ranks/create/create.component';
import { DetailRankComponent } from './pages/customer/ranks/detail/detail.component';

import { RoleComponent } from './pages/configure/roles/role.component';
import { CreateRoleComponent } from './pages/configure/roles/create/create.component';
import { DetailRoleComponent } from './pages/configure/roles/detail/detail.component';

import { StaffComponent } from './pages/configure/staffs/staff.component';
import { CreateStaffComponent } from './pages/configure/staffs/create/create.component';
import { DetailStaffComponent } from './pages/configure/staffs/detail/detail.component';

import { StoreComponent } from './pages/configure/stores/store.component';
import { CreateStoreComponent } from './pages/configure/stores/create/create.component';
import { DetailStoreComponent } from './pages/configure/stores/detail/detail.component';

import { PriceBookComponent } from './pages/configure/price-books/price-book.component';
import { CreatePriceBookComponent } from './pages/configure/price-books/create/create.component';
import { DetailPriceBookComponent } from './pages/configure/price-books/detail/detail.component';

import { ProductTypeComponent } from './pages/configure/product-types/product-type.component';
import { CreateProductTypeComponent } from './pages/configure/product-types/create/create.component';
import { DetailProductTypeComponent } from './pages/configure/product-types/detail/detail.component';

import { MaterialComponent } from './pages/configure/materials/material.component';
import { CreateMaterialComponent } from './pages/configure/materials/create/create.component';
import { DetailMaterialComponent } from './pages/configure/materials/detail/detail.component';

import { ProductComponent } from './pages/configure/products/product.component';
import { CreateProductComponent } from './pages/configure/products/create/create.component';
import { DetailProductComponent } from './pages/configure/products/detail/detail.component';

import { InventoryComponent } from './pages/warehouse/inventories/inventory.component';

import { ImportComponent } from './pages/warehouse/imports/import.component';
import { CreateImportComponent } from './pages/warehouse/imports/create/create.component';
import { DetailImportComponent } from './pages/warehouse/imports/detail/detail.component';

import { ExportComponent } from './pages/warehouse/exports/export.component';
import { CreateExportComponent } from './pages/warehouse/exports/create/create.component';
import { DetailExportComponent } from './pages/warehouse/exports/detail/detail.component';

import { StockTakeComponent } from './pages/warehouse/stock-takes/stock-take.component';
import { CreateStockTakeComponent } from './pages/warehouse/stock-takes/create/create.component';
import { DetailStockTakeComponent } from './pages/warehouse/stock-takes/detail/detail.component';

import { ExportProductionComponent } from './pages/warehouse/productions/production.component';
import { DetailExportProductionComponent } from './pages/warehouse/productions/detail/detail.component';

import { OrderComponent } from './pages/transaction/order.component';
import { OrderDetailComponent } from './pages/transaction/detail/detail.component';
import { OrderCreateAvailableComponent } from './pages/transaction/create/available/available-create.component';
import { OrderCreateTailorComponent } from './pages/transaction/create/tailor/tailor.component';
import { OrderCreateTailorHomeComponent } from './pages/transaction/create/tailor_at_home/tailor-at-home-create.component';
import { OrderCreateWarrantyComponent } from './pages/transaction/create/service/service.component';
import { OrderCreateUniformComponent } from './pages/transaction/create/uniform/uniform-create.component';
import { OrderTableDataAvailableComponent } from './pages/transaction/create/available/component/table/table.component';
import { OrderHeaderAvailableComponent } from './pages/transaction/create/available/component/header/header.component';
import { InformationOrderAvailableComponent } from './pages/transaction/create/available/component/info/info.component';
import { ItemAvailableDetailComponent } from './pages/transaction/create/available/component/item/detail/detail.component';
import { OrderTableDataTailorComponent } from './pages/transaction/create/tailor/components/table/table-data.component';
import { ItemTailorPartialComponent } from './pages/transaction/create/tailor/components/item/create/create.component';
import { OrderHeaderTailorComponent } from './pages/transaction/create/tailor/components/header/header.component';
import { InformationOrderTailorComponent } from './pages/transaction/create/tailor/components/info/info.component';
import { ItemTailorDetailComponent } from './pages/transaction/create/tailor/components/item/detail/detail.component';
import { OrderTableDataTailorAtHomeComponent } from './pages/transaction/create/tailor_at_home/component/table/table.component';
import { OrderHeaderTailorAtHomeComponent } from './pages/transaction/create/tailor_at_home/component/header/header.component';
import { InformationOrderTailorAtHomeComponent } from './pages/transaction/create/tailor_at_home/component/info/info.component';
import { ItemTailorAtHomeComponent } from './pages/transaction/create/tailor_at_home/component/item/create/create.component';
import { ItemTailorAtHomeDetailComponent } from './pages/transaction/create/tailor_at_home/component/item/detail/detail.component';
import { OrderHeaderWarrantyComponent } from './pages/transaction/create/service/component/header/header.component';
import { OrderTableDataWarrantyComponent } from './pages/transaction/create/service/component/table/table.component';
import { InformationOrderWarrantyComponent } from './pages/transaction/create/service/component/info/info.component';
import { ItemWarrantiesPartialComponent } from './pages/transaction/create/service/component/item/create/create.component';
import { ItemDetailWarrantiesPartialComponent } from './pages/transaction/create/service/component/item/detail/detail.component';
import { OrderHeaderUniformComponent } from './pages/transaction/create/uniform/component/header/header.component';
import { InformationOrderUniformComponent } from './pages/transaction/create/uniform/component/info/info.component';
import { OrderTableDataUniformComponent } from './pages/transaction/create/uniform/component/table/table.component';
import { ItemUniformComponent } from './pages/transaction/create/uniform/component/item/create/create.component';
import { ItemDetailUniformComponent } from './pages/transaction/create/uniform/component/item/detail/detail.component';

import { ProductionComponent } from './pages/production/productions/production.component';
import { AssignComponent } from './pages/production/productions/detail/detail.component';
import { ProcessComponent } from './pages/production/process/process.component';
import { DecimalPipe } from '@angular/common';
import { ProcessDetailItemComponent } from './pages/production/process/detail/detail-item.component';


const routes: Routes = [
    {
        path: 'login',
        component: SignInComponent
    },
    {
        path: 'home',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DashboardComponent }
        ]
    },
    {
        path: 'customers',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: CustomerComponent },
            { path: ':id', component: DetailCustomerComponent }
        ]
    },
    {
        path: 'customer-group',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: CustomerGroupComponent },
            { path: 'create', component: CreateCustomerGroupComponent },
            { path: ':id', component: DetailCustomerGroupComponent },
        ]
    },
    {
        path: 'customer-rank',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: RankComponent },
            { path: 'create', component: CreateRankComponent },
            { path: ':id', component: DetailRankComponent },
        ]
    },
    {
        path: 'inventory',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'imports',
                children: [
                    { path: '', component: ImportComponent },
                    { path: 'create', component: CreateImportComponent },
                    { path: ':id', component: DetailImportComponent }
                ]
            },
            {
                path: 'exports',
                children: [
                    { path: '', component: ExportComponent },
                    { path: 'create', component: CreateExportComponent },
                    { path: ':id', component: DetailExportComponent }
                ]
            },
            {
                path: 'stock-takes',
                children: [
                    { path: '', component: StockTakeComponent },
                    { path: 'create', component: CreateStockTakeComponent },
                    { path: ':id', component: DetailStockTakeComponent }
                ]
            },
            {
                path: 'productions',
                children: [
                    { path: '', component: ExportProductionComponent },
                    { path: ':id', component: DetailExportProductionComponent }
                ]
            },
            { path: 'materials', component: InventoryComponent },
            { path: 'product-availables', component: InventoryComponent },
            { path: 'product-services', component: InventoryComponent },
        ]
    },
    {
        path: 'setting',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'stores', component: StoreComponent },
            { path: 'price-books', component: PriceBookComponent },
            { path: 'product-types', component: ProductTypeComponent },
            { path: 'materials', component: MaterialComponent },
            {
                path: 'products',
                children: [
                    { path: '', component: ProductComponent },
                    { path: 'create', component: CreateProductComponent },
                    { path: ':id', component: DetailProductComponent }
                ]
            },
            {
                path: 'roles',
                children: [
                    { path: '', component: RoleComponent },
                    { path: 'create', component: CreateRoleComponent },
                    { path: ':id', component: DetailRoleComponent }
                ]
            },
            {
                path: 'staffs',
                children: [
                    { path: '', component: StaffComponent },
                    { path: 'create', component: CreateStaffComponent },
                    { path: ':id', component: DetailStaffComponent }
                ]
            },
        ]
    },
    {
        path: 'orders',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: OrderComponent },
            { path: 'pending', component: OrderComponent },
            { path: 'tailor', component: OrderComponent },
            { path: 'sale_available', component: OrderComponent },
            { path: 'service', component: OrderComponent },
            { path: 'tailor_at_home', component: OrderComponent },
            { path: 'uniform', component: OrderComponent },
            { path: 'ecommerce', component: OrderComponent },
            { path: 'payments', component: OrderComponent },
            { path: ':id', component: OrderDetailComponent },
        ]
    },
    {
        path: 'sale',
        component: Layout2Component,
        canActivate: [AuthGuard],
        children: [
            { path: 'available', component: OrderCreateAvailableComponent },
            { path: 'tailor', component: OrderCreateTailorComponent },
            { path: 'tailor_at_home', component: OrderCreateTailorHomeComponent },
            { path: 'service', component: OrderCreateWarrantyComponent },
            { path: 'uniform', component: OrderCreateUniformComponent },
        ]
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'productions', component: ProductionComponent },
            { path: 'productions/:id', component: AssignComponent },
        ]
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'process', component: ProcessComponent }
        ]
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];

@NgModule({
    declarations: [
        SignInComponent,
        DashboardComponent,

        // customer.module
        CustomerComponent,
        CreateCustomerComponent,
        DetailCustomerComponent,
        TabCustomerDetailComponent,
        TabCustomerMetricComponent,
        TabCustomerOrderComponent,
        ModalMetricHistoryComponent,
        ModalNoteHistoryComponent,

        CustomerGroupComponent,
        CreateCustomerGroupComponent,
        DetailCustomerGroupComponent,

        RankComponent,
        CreateRankComponent,
        DetailRankComponent,

        // warehouse.module
        InventoryComponent,

        ImportComponent,
        CreateImportComponent,
        DetailImportComponent,

        ExportComponent,
        CreateExportComponent,
        DetailExportComponent,

        StockTakeComponent,
        CreateStockTakeComponent,
        DetailStockTakeComponent,

        ExportProductionComponent,
        DetailExportProductionComponent,

        // setting.module
        RoleComponent,
        CreateRoleComponent,
        DetailRoleComponent,

        StaffComponent,
        CreateStaffComponent,
        DetailStaffComponent,

        StoreComponent,
        CreateStoreComponent,
        DetailStoreComponent,

        PriceBookComponent,
        CreatePriceBookComponent,
        DetailPriceBookComponent,

        ProductTypeComponent,
        CreateProductTypeComponent,
        DetailProductTypeComponent,

        MaterialComponent,
        CreateMaterialComponent,
        DetailMaterialComponent,
        ProcessDetailItemComponent,
        ProductComponent,
        CreateProductComponent,
        DetailProductComponent,

        // transaction.module.ts
        OrderComponent,
        OrderDetailComponent,

        // create order available
        OrderCreateAvailableComponent,
        OrderTableDataAvailableComponent,
        OrderHeaderAvailableComponent,
        InformationOrderAvailableComponent,
        ItemAvailableDetailComponent,

        // create order tailor
        OrderCreateTailorComponent,
        OrderTableDataTailorComponent,
        ItemTailorPartialComponent,
        OrderHeaderTailorComponent,
        InformationOrderTailorComponent,
        ItemTailorDetailComponent,

        // create order tailor at home
        OrderCreateTailorHomeComponent,
        OrderTableDataTailorAtHomeComponent,
        OrderHeaderTailorAtHomeComponent,
        InformationOrderTailorAtHomeComponent,
        ItemTailorAtHomeComponent,
        ItemTailorAtHomeDetailComponent,

        // create order service
        OrderCreateWarrantyComponent,
        OrderHeaderWarrantyComponent,
        OrderTableDataWarrantyComponent,
        InformationOrderWarrantyComponent,
        ItemWarrantiesPartialComponent,
        ItemDetailWarrantiesPartialComponent,

        // create order uniform
        OrderCreateUniformComponent,
        OrderHeaderUniformComponent,
        InformationOrderUniformComponent,
        OrderTableDataUniformComponent,
        ItemUniformComponent,
        ItemDetailUniformComponent,

        /** production */
        ProductionComponent,
        AssignComponent,

        /** process */
        ProcessComponent
    ],
    providers: [
        // Utilities
        Helpers,
        HttpUtilsService,
        TypesUtilsService,
        DecimalPipe,

        // Configs
        FilterConfig,
        BaseConfig,
        DesignConfig,

        // Services
        ServiceClient,
        BsModalService,
        ToastrService,
        ModalService
    ],
    imports: [
        // Base
        HttpModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        PartialsModule,

        // Plugins
        NgSelectModule,
        NgxDatatableModule,
        CKEditorModule,
        ToastrModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot(),
        BsDatepickerModule.forRoot(),
        NgxCurrencyModule.forRoot({
            align: 'right',
            allowNegative: true,
            allowZero: true,
            decimal: ',',
            precision: 0,
            prefix: '',
            suffix: '',
            thousands: ',',
            nullable: true
        }),

        // Routing
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule { }
