import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Inventory, Item, ItemBase, ItemTransferMessage} from "../../../model";
import {CreateItemEvent} from "../../../events";
import {BalModalService} from "@baloise/design-system-components-angular";
import {ItemBaseSelectionComponent} from "../item-base-selection/item-base-selection.component";
import {Client} from "@stomp/stompjs";

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  @Input()
  inventory!: Inventory

  @Input()
  client!: Client

  @Output()
  itemCreated = new EventEmitter<CreateItemEvent>

  @Output()
  hoverOverItem = new EventEmitter<Item>;

  @Output()
  exitItem = new EventEmitter<Item>;

  @Output()
  moveItem = new EventEmitter<ItemTransferMessage>

  dropzone: boolean = false;

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

  onDropzoneDrop(event: DragEvent) {
    const data = this.getItemFromEvent(event)
    if (data) {
      this.moveItem.emit({
        id: data.id,
        targetInventoryId: this.inventory.id
      })
    }
    this.dropzone = false;
  }

  private getItemFromEvent(event: DragEvent): Item | undefined {
    if (!event.dataTransfer) {
      return undefined;
    }
    return JSON.parse(event.dataTransfer.getData("application/json")) as Item;
  }

  onDropzoneDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDropzoneDragEnter(event: DragEvent) {
    event.preventDefault();
  }

  onDragEnter() {
    this.dropzone = true;
    console.log("dzone")
  }

  onHoverOverItem(item: Item) {
    this.hoverOverItem.emit(item);
  }

  onExitItem(item: Item) {
    this.exitItem.emit(item)
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dropzone = false;
    console.log("no dzone");
  }
}
