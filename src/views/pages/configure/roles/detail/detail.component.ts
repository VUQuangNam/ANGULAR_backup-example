import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Plugins
import { ToastrService } from 'ngx-toastr';

// Modules
import { Helpers } from 'src/common/utils';
import { RoleService } from 'src/common/services';
import { ErrorModel, Permission, Role } from 'src/common/models';

@Component({
    selector: '.c-body',
    templateUrl: './detail.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        RoleService
    ]
})

export class DetailRoleComponent implements OnInit {
    // Variables
    model: any = {};
    permissions: any = [];

    constructor(
        private toastrService: ToastrService,
        private service: RoleService,
        private route: ActivatedRoute,
        private helpers: Helpers,
    ) { }

    async ngOnInit() {
        try {
            await this.service.detail(
                this.route.snapshot.params.id
            ).then(res => {
                if (res.code) {
                    const error = new ErrorModel(res);
                    this.toastrService.warning(error.getMessage);
                    return false;
                }

                // Handle Success
                this.model = res.role;
                this.permissions = new Permission().getPermissions;
                this.permissions.map(group => {
                    const unChecked = [];
                    group.menus.map(menu => {
                        menu.permissions.map(permission => {
                            const isSelected = this.model.permissions.find(
                                x => x.id === permission.id
                            );
                            if (isSelected) permission.checked = true;
                            if (!permission.checked) unChecked.push(1);
                        });
                    });
                    group.checked = unChecked.length ? false : true;
                });
            }).catch(ex => {
                throw Error(ex);
            });
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
     * Update
     * @param {*} f
     */
    onUpdate() {
        this.helpers.openLoading();
        // transform data
        this.model.permissions = [];
        this.permissions.map(group => {
            group.menus.map(menu => {
                menu.permissions.map(permission => {
                    if (permission.checked) {
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
        this.service.update(
            this.model.id,
            new Role(this.model)
        ).then(res => {
            if (res.code) {
                const error = new ErrorModel(res);
                this.toastrService.warning(error.getMessage);
                return false;
            }

            // Handle Success
            this.toastrService.success('Cập nhật thành công!');
            return true;
        }).catch(ex => {
            throw (ex);
        }).finally(() => {
            this.helpers.closeLoading();
        });
    }
}
