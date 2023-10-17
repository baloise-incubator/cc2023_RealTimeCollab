import {Component, Input} from '@angular/core';
import {Item} from "../../../model";

@Component({
  selector: 'app-inventory-item',
  templateUrl: './inventory-item.component.html',
  styleUrls: ['./inventory-item.component.scss']
})
export class InventoryItemComponent {
  @Input()
  item!: Item;

  onDragStart(event: DragEvent) {
    event.dataTransfer?.clearData()
    event.dataTransfer?.setData("application/json", JSON.stringify( {
      target: this.item
    }))
  }
}
