import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';

@Injectable()
export class TypesUtilsService {
    /**
     * Convert unix to date
     * @param {Any} date
     */
    datePipe = (date: any) => moment.unix(date).toDate();

    /**
     * Convert unix to date
     * @param {Number} date
     * @param {String} format
     */
    formatDate = (date: any, format: string) => moment.unix(date).format(format);

    /**
     * Conver date to unix
     * @param {String} date
     */
    convertDateToUnix = (date: string) => moment(date).unix();

    /**
     * Checking value type equals to Number
     *
     * @param value: any
     */
    isNumber(value: any): boolean {
        return !isNaN(this.toInteger(value));
    }

    /**
     * Covert value to number
     *
     * @param value: any
     */
    toInteger(value: any): number {
        return parseInt(`${value}`, 10);
    }

    pipe = (price) => {
        const formater = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
        return formater.format(price);
    }
}
