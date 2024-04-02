import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/_services/token.service';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { FullWindowComponent } from './full-window/full-window.component';
import { NarrowWindowComponent } from './narrow-window/narrow-window.component';
import { TopBarComponent } from './narrow-window/top-bar/top-bar.component';
import { LeftSideBarComponent } from './narrow-window/left-side-bar/left-side-bar.component';
import { FullLoaderComponent } from './full-loader/full-loader.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormControllerModule } from './shared/form-controller/form-controller.module';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { customToast } from './customtoast.component';
const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline'
};
export function jwtOptionsFactory(tokenService: TokenService) {
  return {
    tokenGetter: () => {
      return tokenService.token;
    },
    whitelistedDomains: environment.whitelistedDomains,
  }
}
@NgModule({
  declarations: [
    AppComponent,
    FullWindowComponent,
    NarrowWindowComponent,
    TopBarComponent,
    LeftSideBarComponent,
    FullLoaderComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    FormControllerModule,
    MatDialogModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [TokenService],
      }
    }),
  ],
  entryComponents: [customToast],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: appearance
    }, 
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true}

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
