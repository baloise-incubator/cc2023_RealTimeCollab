export interface CheckInForm {
    username: string
}

export interface Stock {
    name: string,
    icon: string,
    price: number,
    increased: boolean
}

export interface Button {
    user: string
}

export interface Credentials {
    username: string
    password: string
}

export interface User {
    name: string
    color: string
}

export interface Cursor {
    name: string
    color: string;
    posX: number;
    posY: number;
}

export interface Character {
    name: string;
    color: string;
    posX: number;
    posY: number;
}

export interface Pickup {
    icon: string;
    color: string;
    posX: number;
    posY: number;
}

export interface Item {
    userLock: string;
    id: number;
    name: string;
}

export interface Inventory {
    id: number;
    owner?: string;
    items: Item[];
}

export interface ChatMessage {
    user: User,
    text: string,
    timestamp: Date
}

export interface ItemBase {
    name: string;
    label: string;
}

export interface ItemLockMessage {
    id: number,
    lock: boolean
}

export interface ItemTransferMessage {
    id: number,
    targetInventoryId: number
}

export interface UserColor {
    name: string;
    color: string;
}

export interface ItemDragInfo {
    name: string;
    id : number;
    posX: number;
    posY: number;
    finished : boolean;
    draggingPlayer : string;
}