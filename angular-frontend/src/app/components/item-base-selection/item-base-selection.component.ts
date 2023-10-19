import {Component, Input} from '@angular/core';
import store from "../../../store";
import {ItemBase} from "../../../model";

@Component({
  selector: 'app-item-base-selection',
  templateUrl: './item-base-selection.component.html',
  styleUrls: ['./item-base-selection.component.scss']
})
export class ItemBaseSelectionComponent {

    @Input()
    onSelected?: (base: ItemBase) => void;

    get itemBases() {
        return store.itemBases;
    }

    onItemClicked(base: ItemBase) {
        this.onSelected && this.onSelected(base);
    }
}
