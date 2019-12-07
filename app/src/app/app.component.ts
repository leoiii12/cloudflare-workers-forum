import { flatMap } from 'rxjs/operators'

import { Component } from '@angular/core'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { Platform } from '@ionic/angular'

import { DefaultService, GetCategoriesOutput, GetPostsOutput } from '../api'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home',
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list',
    },
  ]

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private defaultService: DefaultService,
  ) {
    this.initializeApp()
  }

  public initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault()
      this.splashScreen.hide()

      this.defaultService
        .userauthorizePost({
          emailAddress: 'choimankin@gmail.com',
          password: '12345678',
        })
        .subscribe(output => {
          console.log(output)
        })

      this.defaultService
        .categorygetCategoriesPost()
        .pipe(
          flatMap((getCategoriesOutput: GetCategoriesOutput) => {
            return this.defaultService.postgetPostsPost({
              categoryId: getCategoriesOutput.categories[0].id,
            })
          }),
        )
        .subscribe((getPostsOutput: GetPostsOutput) => {
          console.log(getPostsOutput)
        })
    })
  }
}
