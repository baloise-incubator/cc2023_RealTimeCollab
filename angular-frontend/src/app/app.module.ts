import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BaloiseDesignSystemModule } from '@baloise/design-system-components-angular'
import { AppComponent } from './app.component';
import { CheckInComponent } from './components/check-in/check-in.component'
import {ReactiveFormsModule} from "@angular/forms";
import { InventoryComponent } from './components/inventory/inventory.component';
import { InventoryItemComponent } from './components/inventory-item/inventory-item.component';

@NgModule({
  declarations: [AppComponent, CheckInComponent, InventoryComponent, InventoryItemComponent],
    imports: [
        BrowserModule,
        // Provide all components and value accessors to the app module.
        BaloiseDesignSystemModule.forRoot(),
        ReactiveFormsModule,
    ],
  providers: [],
  bootstrap: [AppComponent],
  // To enable the usage of Web Components inside the Angular templates.
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
