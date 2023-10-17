import { Component } from '@angular/core';
import { FormControl, FormGroup} from "@angular/forms";
import { BalValidators } from "@baloise/web-app-validators-angular";
import {CheckInForm} from "../../../model";

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent {

    form = new FormGroup({
       username: new FormControl("", BalValidators.isRequired())
    });

    onCheckIn() {
        const payload = this.form.value as CheckInForm;
        console.log(payload)
        //todo: send over to backend
    }
}
