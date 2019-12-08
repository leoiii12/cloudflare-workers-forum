import { flatMap } from 'rxjs/operators'

import { Component } from '@angular/core'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { NavController, Platform } from '@ionic/angular'

import {
  DefaultService,
  GetCategoriesOutput,
  GetPostsOutput,
  PostDto,
} from '../api'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public posts: PostDto[]

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private defaultService: DefaultService,
    private navCtrl: NavController,
  ) {
    this.initializeApp()
  }

  public initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault()
      this.splashScreen.hide()

      this.defaultService
        .userAuthorizePost({
          emailAddress: 'choimankin@gmail.com',
          password: '12345678',
        })
        .subscribe(output => {
          console.log(output)
        })

      this.defaultService
        .categoryGetCategoriesPost()
        .pipe(
          flatMap((getCategoriesOutput: GetCategoriesOutput) => {
            return this.defaultService.postGetPostsPost({
              categoryId: getCategoriesOutput.categories[0].id,
            })
          }),
        )
        .subscribe((getPostsOutput: GetPostsOutput) => {
          this.posts = getPostsOutput.posts
        })
    })
  }

  public onClickPost(post: PostDto) {
    this.navCtrl.navigateRoot(`/post/${post.id}`)
  }
}
