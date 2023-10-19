import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Inventory} from "../../../model";
import {CreateItemEvent} from "../../../events";

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  @Input()
  inventory!: Inventory

  @Output()
  moveRequested = new EventEmitter<string>

  @Output()
  itemCreated = new EventEmitter<CreateItemEvent>

  ngOnInit(): void {
    console.log(this.inventory)
  }

  //todo: do propurle
  temporaryCreate() {
    this.itemCreated.emit({ name: 'gold' })
  }

  onDrop(event: DragEvent) {
    console.log("drop", event.dataTransfer?.getData("application/json"));
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    console.log("over");
  }

  onDragEnter(event: DragEvent) {
    event.preventDefault();
    console.log("enter");
  }
}
