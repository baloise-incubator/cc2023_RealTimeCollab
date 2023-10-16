import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BaloiseDesignSystemModule } from '@baloise/design-system-components-angular'
import { AppComponent } from './app.component'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    // Provide all components and value accessors to the app module.
    BaloiseDesignSystemModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
  // To enable the usage of Web Components inside the Angular templates.
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
