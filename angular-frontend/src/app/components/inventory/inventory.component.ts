import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Inventory, Item, ItemBase, ItemTransferMessage} from "../../../model";
import {CreateItemEvent} from "../../../events";
import {BalModalService} from "@baloise/design-system-components-angular";
import {ItemBaseSelectionComponent} from "../item-base-selection/item-base-selection.component";

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  @Input()
  inventory!: Inventory

  @Output()
  itemCreated = new EventEmitter<CreateItemEvent>

  @Output()
  hoverOverItem = new EventEmitter<Item>;

  @Output()
  exitItem = new EventEmitter<Item>;

  @Output()
  moveItem = new EventEmitter<ItemTransferMessage>

  constructor(private modalService: BalModalService) {}

  ngOnInit(): void {
    console.log(this.inventory)
  }

  async onCreateNew() {
    const modal = await this.modalService.create({
      component: ItemBaseSelectionComponent,
      componentProps: {
        onSelected: (base: ItemBase) => {
          modal.dismiss();
          this.createItemFromSelectedItemBase(base)
        }
      }
    })
    await modal.present();
  }

  createItemFromSelectedItemBase(base: ItemBase) {
    this.itemCreated.emit({ name: base.name })
  }

  onDrop(event: DragEvent) {
    if (event.dataTransfer) {
      const data = JSON.parse(event.dataTransfer.getData("application/json")) as Item
      this.moveItem.emit({
        id: data.id,
        targetInventoryId: this.inventory.id
      })
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    console.log("over");
  }

  onDragEnter(event: DragEvent) {
    event.preventDefault();
    console.log("enter");
  }

  onHoverOverItem(item: Item) {
    this.hoverOverItem.emit(item);
  }

  onExitItem(item: Item) {
    this.exitItem.emit(item)
  }
}
