import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'c-dashboard',
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None
})

export class DashboardComponent {
    rows = [{ name: 'haha' }];
    collums = [{ id: 'name', lable: 'Tên' }];
    count = 0;

    onChangeData() {
        this.count += 1;
        const rows = [...this.rows];
        rows.push({ name: 'hehe ' + this.count });
        this.rows = [...rows];
    }
}
