import { Component, ViewEncapsulation } from '@angular/core';

// Modules
import { BaseConfig } from 'src/config';
import { Helpers } from 'src/common/utils';
import { Storage } from 'src/common/models';

@Component({
    selector: 'c-header-top',
    templateUrl: './header-top.component.html',
    styleUrls: ['./header-top.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class HeaderTopComponent {
    // Variabales
    user: any = {};

    constructor(
        private helpers: Helpers,
        private baseConfig: BaseConfig,
    ) {
        this.user = this.baseConfig.getUser;
    }


    /**
     * Sign out
     * @param {*} clear
     */
    onSignOut() {
        try {
            this.helpers.openLoading();

            // clear local data
            localStorage.removeItem(Storage.USER);
            localStorage.removeItem(Storage.STORES);
            localStorage.removeItem(Storage.TOKEN);
            localStorage.removeItem(Storage.TOKEN_EXPIRED_AT);

            // navigate login
            window.location.href = 'login';
            return true;
        } catch (ex) {
            throw Error(ex);
        } finally {
            this.helpers.closeLoading();
        }
    }
}
