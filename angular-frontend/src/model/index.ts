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
    passcode: string
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