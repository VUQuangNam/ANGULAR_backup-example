import { Component, ViewEncapsulation, OnInit } from '@angular/core';

// Plugins
import { ToastrService } from 'ngx-toastr';

// Modules
import { Helpers } from 'src/common/utils';
import { ErrorModel, Permission, Role } from 'src/common/models';
import { RoleService } from 'src/common/services';

@Component({
    selector: '.c-body',
    templateUrl: './create.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        RoleService
    ]
})

export class CreateRoleComponent implements OnInit {
    // Variables
    model: any = {};
    permissions: any = [];

    constructor(
        private toastrService: ToastrService,
        private service: RoleService,
        private helpers: Helpers
    ) { }

    ngOnInit() {
        try {
            this.helpers.openLoading();

            // load configuration
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
     * Create customer
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
            new Role(this.model)
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
