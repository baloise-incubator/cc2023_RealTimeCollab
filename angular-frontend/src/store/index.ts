import {ItemBase, User, UserColor} from "../model";

//me very lazy
export class MyStore {
    private _itemBases: ItemBase[] = []
    private _currentUser?: string;
    private _userColors : UserColor[] = []
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

    public setUserColor(userColor : UserColor) {
        const index = this._userColors.findIndex(color => color.name == userColor.name)
        if(index < 0){
            this._userColors.push(userColor)
        } else {
            this._userColors[index] = userColor
        }
    }

    public getColorForUserName(name : String) {
        const userColor= this._userColors.find(userColor => userColor.name == name)
        if(userColor == undefined){
            return "warning"
        } else {
            return userColor.color
        }
    }

    public get userColors(){
        return this._userColors
    }
}

const store = new MyStore()
export default store