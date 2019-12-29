import { from } from 'rxjs'

import { Component } from '@angular/core'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { NavController, Platform, PopoverController } from '@ionic/angular'

import { CategoryDto, DefaultService, PostDto } from '../api'
import {
  CreatePostComponent,
  ICreatePostComponentProps,
} from './popovers/create-post/create-post.component'
import { PostService } from './post.service'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public posts: PostDto[]

  public categoryId: string =
    '31d8d48a7adaae3234afe59d5c702c90144cb5fde976567a9f50ce601b2a9227'
  public category: CategoryDto

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private defaultService: DefaultService,
    private navCtrl: NavController,
    private postService: PostService,
    private popoverCtrl: PopoverController,
  ) {
    this.initializeApp()
  }

  public initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault()
      this.splashScreen.hide()
    })

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

    this.getPosts(this.categoryId).subscribe(posts => (this.posts = posts))
  }

  public async onClickCreatePost(ev: Event) {
    const popover = await this.popoverCtrl.create({
      component: CreatePostComponent,
      // tslint:disable-next-line: no-object-literal-type-assertion
      componentProps: {
        categoryId: this.categoryId,
      } as ICreatePostComponentProps,
      event: ev,
      translucent: true,
    })

    from(popover.onDidDismiss()).subscribe(() => {
      this.getPosts(this.categoryId).subscribe(posts => (this.posts = posts))
    })

    return popover.present()
  }

  public onClickRefresh(ev: Event) {
    this.posts = []
    this.getPosts(this.categoryId).subscribe(posts => (this.posts = posts))
  }

  public onClickPost(post: PostDto) {
    this.navCtrl.navigateRoot(`/post/${post.id}`)
  }

  public trackByFn(idx: number, item: { id: string }) {
    return item.id
  }

  private getPosts(categoryId: string) {
    return this.postService.getPosts(categoryId)
  }
}
