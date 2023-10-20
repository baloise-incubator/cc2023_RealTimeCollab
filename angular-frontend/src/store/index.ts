import {ItemBase} from "../model";

//me very lazy
export class MyStore {
    private _itemBases: ItemBase[] = []
    private _currentUser?: string;
    public get itemBases(): ItemBase[] {
        return this._itemBases;
    }
    public set itemBases(itemBases: ItemBase[]) {
        this._itemBases = itemBases;
    }

    public get currentUser(): string {
        return this._currentUser!;
    }

    public set currentUser(currentUser: string) {
        this._currentUser = currentUser;
    }
}

const store = new MyStore()
export default store