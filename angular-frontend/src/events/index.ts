import {Inventory, Item} from "../model";

export interface ItemDraggingEvent {
    target: Item
    to: Inventory
}