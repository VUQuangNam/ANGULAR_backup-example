import { Injectable } from '@angular/core';
import * as $ from 'jquery';

@Injectable()
export class Helpers {
    constructor() { }
    setCookie(name: string, value: string, exdays: number) {
        const date = new Date();
        date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
        const expires = 'expires=' + date.toUTCString();
        document.cookie = name + '=' + value + ';' + expires + ';path=/';
    }

    getCookie(name: string) {
        const item = document.cookie.split(';').filter(x => x.includes(name));
        return !item[0] ? '' : item[0].split('=')[1];
    }

    revmoveCookie(name: string) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        return true;
    }

    /**
     * Parse text params to object
     * @param params
     */
    parseParams(params: string) {
        return params
            .replace(/(^\?)/, '')
            .split('&')
            .map(function (n) {
                return n = n.split('='),
                    this[n[0]] = n[1],
                    this;
            }.bind({}))[0];
    }

    print(body: string, title?: string) {
        const myWindow = window.open('', '', 'width=1320,height=600');
        myWindow.document.write('<html><head><title>Dunnio.com.vn</title>');
        myWindow.document.write('</head><body>');
        myWindow.document.write(body);
        myWindow.document.write('</body></html>');
        myWindow.document.close();
        myWindow.focus();
        myWindow.print();
        return true;
    }


    /**
     * Open loading
     * @public
     */
    openLoading = () => $('.c-loading').removeClass('c-loading--hidden');

    /**
     * Close loading
     * @public
     */
    closeLoading = () => $('.c-loading').addClass('c-loading--hidden');
}
