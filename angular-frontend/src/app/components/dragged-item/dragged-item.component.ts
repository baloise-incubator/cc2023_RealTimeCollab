import {Component, Input} from '@angular/core';
import {ItemDragInfo} from "../../../model";

@Component({
  selector: 'app-dragged-item',
  templateUrl: './dragged-item.component.html',
  styleUrls: ['./dragged-item.component.scss']
})
export class DraggedItemComponent {
  @Input()
  itemDragInfo!: ItemDragInfo
}
