import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BaloiseDesignSystemModule } from '@baloise/design-system-components-angular'
import { AppComponent } from './app.component';
import { CheckInComponent } from './components/check-in/check-in.component'
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { InventoryComponent } from './components/inventory/inventory.component';
import { InventoryItemComponent } from './components/inventory-item/inventory-item.component';
import { ChatComponent } from './components/chat/chat.component';
import { StockComponent } from './components/stock/stock.component';
import { UserBarComponent } from './components/user-bar/user-bar.component';
import { balIconAccount, balIconSend } from '@baloise/design-system-icons'

@NgModule({
  declarations: [AppComponent, CheckInComponent, InventoryComponent, InventoryItemComponent, ChatComponent, StockComponent, UserBarComponent],
    imports: [
        BrowserModule,
        // Provide all components and value accessors to the app module.
        BaloiseDesignSystemModule.forRoot({
            defaults: {
                icons: { balIconAccount, balIconSend },
            },
        }),
        FormsModule,
        ReactiveFormsModule,
    ],
  providers: [],
  bootstrap: [AppComponent],
  // To enable the usage of Web Components inside the Angular templates.
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
