import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup} from "@angular/forms";
import { BalValidators } from "@baloise/web-app-validators-angular";
import {CheckInForm, Credentials} from "../../../model";

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent {

  @Output()
  onCheckin = new EventEmitter<Credentials>()

    form = new FormGroup({
        username: new FormControl("", BalValidators.isRequired()),
        passcode: new FormControl("", BalValidators.isRequired())
    });

    onCheckIn() {
        const payload = this.form.value as Credentials;
        console.log(payload)
        this.onCheckin.emit(payload)
    }
}
