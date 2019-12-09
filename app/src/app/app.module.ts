import { WebStorageModule } from 'ngx-store'

import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouteReuseStrategy } from '@angular/router'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { IonicModule, IonicRouteStrategy } from '@ionic/angular'

import { ApiModule } from '../api'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { PipesModule } from './pipes/pipes.module'
import { PostService } from './post.service'
import { ReplyService } from './reply.service'
import { UserService } from './user.service'

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    WebStorageModule,
    ApiModule,
    HttpClientModule,
    PipesModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    UserService,
    PostService,
    ReplyService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
