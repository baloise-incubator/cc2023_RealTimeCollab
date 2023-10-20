import { Component, Input} from '@angular/core';

import { User } from '../../../model';

@Component({
  selector: 'app-user-bar',
  template: `
    <bal-tag-group>
      <bal-popover *ngFor="let user of users" arrow hover tooltip :hover="hover">
        <bal-tag [color]="user.color" bal-popover-trigger aria-haspopup="true" aria-describedby="tooltip">
          {{ user.name.at(0) }}
        </bal-tag>
        <bal-popover-content>{{ user.name }}</bal-popover-content>
      </bal-popover>
    </bal-tag-group>
  `
})
export class UserBarComponent {

  @Input() users!: User[]

}
