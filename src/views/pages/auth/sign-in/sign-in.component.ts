import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/common/services';
import { Storage, ErrorModel } from 'src/common/models';

@Component({
    selector: '.c-login-warpper',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        AuthService
    ]
})

export class SignInComponent implements OnInit {
    constructor(
        private serivce: AuthService,
    ) { }

    async ngOnInit() {
        const token = localStorage.getItem(Storage.TOKEN);
        if (token) return window.location.href = '/home';
    }

    /**
     * Login
     * @param {*} f
     */
    onLogin(f: any) {
        this.serivce.login(
            f.value
        ).then(async res => {
            if (res.code) {
                const error = new ErrorModel(res);
                return alert(error.getMessage);
            }

            // Add local storage
            const { token, user } = res.data;
            console.log(user);
            localStorage.setItem(Storage.USER, JSON.stringify(user));
            localStorage.setItem(Storage.TOKEN, token.access_token);
            localStorage.setItem(Storage.TOKEN_EXPIRED_AT, token.access_expired_at);
            localStorage.setItem(Storage.STORES, JSON.stringify(user.stores));

            // Redirect
            return window.location.href = '/home';
        }).catch(ex => {
            throw (ex);
        });
    }
}
