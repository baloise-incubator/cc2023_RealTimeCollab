import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Inventory, Item} from "../../../model";

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

  ngOnInit(): void {
    console.log(this.inventory)
  }

  private insertItem(item: Item) {
    this.inventory.items.push(item);
  }

  private removeItem(item: Item) {
    this.inventory.items.splice(this.inventory.items.indexOf(item), 1);
  }

  temporarySpawn() {
    this.insertItem({id: crypto.randomUUID(), name: 'gold'})
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
