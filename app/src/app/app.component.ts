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
import { PostService } from './post.service'

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
    private postService: PostService,
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

      this.defaultService.categoryGetCategoriesPost().subscribe(output => {
        console.log(output)
      })
    })
  }

  public onClickRefresh(ev: Event) {
    this.postService
      .getPosts(
        '31d8d48a7adaae3234afe59d5c702c90144cb5fde976567a9f50ce601b2a9227',
      )
      .subscribe(posts => {
        this.posts = posts
      })
  }

  public onClickPost(post: PostDto) {
    this.navCtrl.navigateRoot(`/post/${post.id}`)
  }
}
