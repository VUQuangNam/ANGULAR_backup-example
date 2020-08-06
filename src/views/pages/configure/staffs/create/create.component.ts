import { Component, ViewEncapsulation, OnInit } from '@angular/core';

// Plugins
import { ToastrService } from 'ngx-toastr';

// Modules
import { Helpers } from 'src/common/utils';
import { ErrorModel, Permission, Staff } from 'src/common/models';
import { StaffService, StoreService, RoleService } from 'src/common/services';

@Component({
    selector: '.c-body',
    templateUrl: './create.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        StaffService,
        StoreService,
        RoleService
    ]
})

export class CreateStaffComponent implements OnInit {
    // Variables
    model: any = {};
    roles: any = [];
    stores: any = [];
    permissions: any = [];

    constructor(
        private toastrService: ToastrService,
        private storeService: StoreService,
        private roleService: RoleService,
        private service: StaffService,
        private helpers: Helpers
    ) { }

    async ngOnInit() {
        try {
            this.helpers.openLoading();

            // load configuration
            await this.storeService.list({ skip: 0, limit: 100 })
                .then(res => this.stores = res.code ? [] : res.data);

            await this.roleService.list({ skip: 0, limit: 100 })
                .then(res => this.roles = res.code ? [] : res.roles);

            this.permissions = new Permission().getPermissions;
        } catch (ex) {
            throw Error(ex);
        } finally {
            this.helpers.closeLoading();
        }
    }

    /**
     * Change Checkbox Parent
     * @param {*} parentId
     */
    onChangeCheckboxParent(parentId) {
        try {
            const changedPermissions = [...this.permissions];
            changedPermissions.map(group => {
                if (group.id === parentId) {
                    group.checked = !group.checked;
                    group.menus.map(menu => {
                        menu.permissions.map(permission => {
                            permission.checked = group.checked;
                        });
                    });
                }
            });
            this.permissions = [...changedPermissions];
            return true;
        } catch (ex) {
            throw Error(ex);
        }
    }

    /**
     * Change Checkbox Parent
     * @param {*} parentId
     * @param {*} childId
     */
    onChangeCheckboxChild(parentId, childId) {
        try {
            const changedPermissions = [...this.permissions];
            changedPermissions.map(group => {
                if (group.id === parentId) {
                    const unChecked = [];
                    group.menus.map(menu => {
                        menu.permissions.map(permission => {
                            if (permission.id === childId) permission.checked = !permission.checked;
                            if (!permission.checked) unChecked.push(permission.id);
                        });
                    });
                    group.checked = unChecked.length ? false : true;
                }
            });
            this.permissions = [...changedPermissions];
            return true;
        } catch (ex) {
            throw Error(ex);
        }
    }

    /**
     * Change Role
     * @param {*} roleId
     */
    onChangeRole(roleId) {
        try {
            const role = this.roles.find(
                x => x.id === roleId
            );
            if (role) {
                this.permissions.map(group => {
                    const unChecked = [];
                    group.menus.map(menu => {
                        menu.permissions.map(permission => {
                            const isSelected = role.permissions.find(
                                x => x.id === permission.id
                            );
                            permission.checked = isSelected ? true : false;
                            if (!permission.checked) unChecked.push(1);
                        });
                    });
                    group.checked = unChecked.length ? false : true;
                });
            }
            return true;
        } catch (ex) {
            throw Error(ex);
        }
    }

    /**
     * Create
     * @param {*} f
     */
    onCreate() {
        this.helpers.openLoading();

        // transform data
        this.model.permissions = [];
        this.permissions.map(group => {
            group.checked = false;
            group.menus.map(menu => {
                menu.permissions.map(permission => {
                    if (permission.checked) {
                        permission.checked = false;
                        this.model.permissions.push({
                            group: menu.id,
                            id: permission.id,
                            name: permission.name
                        });
                    }
                });
            });
        });

        // sumit data
        this.service.create(
            new Staff(this.model)
        ).then(res => {
            if (res.code) {
                const error = new ErrorModel(res);
                this.toastrService.warning(error.getMessage);
                return false;
            }

            // TODO:: Success
            $('form').trigger('reset');
            this.toastrService.success('Thêm mới thành công!');
            return true;
        }).catch(ex => {
            throw (ex);
        }).finally(() => {
            this.helpers.closeLoading();
        });
    }
}
