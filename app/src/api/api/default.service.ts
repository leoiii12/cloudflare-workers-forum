/**
 * MySwaggerDoc
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional } from '@angular/core'
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpEvent,
} from '@angular/common/http'
import { CustomHttpUrlEncodingCodec } from '../encoder'

import { Observable } from 'rxjs/Observable'

import { AuthorizeInput } from '../model/authorizeInput'
import { AuthorizeOutput } from '../model/authorizeOutput'
import { CreateCategoryInput } from '../model/createCategoryInput'
import { CreateCategoryOutput } from '../model/createCategoryOutput'
import { CreatePostInput } from '../model/createPostInput'
import { CreatePostOutput } from '../model/createPostOutput'
import { CreateReplyInput } from '../model/createReplyInput'
import { CreateReplyOutput } from '../model/createReplyOutput'
import { GetCategoriesOutput } from '../model/getCategoriesOutput'
import { GetPostInput } from '../model/getPostInput'
import { GetPostOutput } from '../model/getPostOutput'
import { GetPostsInput } from '../model/getPostsInput'
import { GetPostsOutput } from '../model/getPostsOutput'
import { GetRepliesInput } from '../model/getRepliesInput'
import { GetRepliesOutput } from '../model/getRepliesOutput'
import { GetUserPostsInput } from '../model/getUserPostsInput'
import { GetUserPostsOutput } from '../model/getUserPostsOutput'
import { GetUsersInput } from '../model/getUsersInput'
import { GetUsersOutput } from '../model/getUsersOutput'
import { SignUpInput } from '../model/signUpInput'
import { SignUpOutput } from '../model/signUpOutput'
import { UpdateUserInput } from '../model/updateUserInput'

import { BASE_PATH, COLLECTION_FORMATS } from '../variables'
import { Configuration } from '../configuration'

@Injectable()
export class DefaultService {
  protected basePath = 'https://forum-api.lecom.cloud'
  public defaultHeaders = new HttpHeaders()
  public configuration = new Configuration()

  constructor(
    protected httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration,
  ) {
    if (basePath) {
      this.basePath = basePath
    }
    if (configuration) {
      this.configuration = configuration
      this.basePath = basePath || configuration.basePath || this.basePath
    }
  }

  /**
   * @param consumes string[] mime-types
   * @return true: consumes contains 'multipart/form-data', false: otherwise
   */
  private canConsumeForm(consumes: string[]): boolean {
    const form = 'multipart/form-data'
    for (const consume of consumes) {
      if (form === consume) {
        return true
      }
    }
    return false
  }

  /**
   *
   *
   * @param body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public categoryCreateCategoryPost(
    body: CreateCategoryInput,
    observe?: 'body',
    reportProgress?: boolean,
  ): Observable<CreateCategoryOutput>
  public categoryCreateCategoryPost(
    body: CreateCategoryInput,
    observe?: 'response',
    reportProgress?: boolean,
  ): Observable<HttpResponse<CreateCategoryOutput>>
  public categoryCreateCategoryPost(
    body: CreateCategoryInput,
    observe?: 'events',
    reportProgress?: boolean,
  ): Observable<HttpEvent<CreateCategoryOutput>>
  public categoryCreateCategoryPost(
    body: CreateCategoryInput,
    observe: any = 'body',
    reportProgress: boolean = false,
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling categoryCreateCategoryPost.',
      )
    }

    let headers = this.defaultHeaders

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json']
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts)
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected)
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json']
    const httpContentTypeSelected:
      | string
      | undefined = this.configuration.selectHeaderContentType(consumes)
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected)
    }

    return this.httpClient.post<CreateCategoryOutput>(
      `${this.basePath}/category/createCategory`,
      body,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      },
    )
  }

  /**
   *
   *
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public categoryGetCategoriesPost(
    observe?: 'body',
    reportProgress?: boolean,
  ): Observable<GetCategoriesOutput>
  public categoryGetCategoriesPost(
    observe?: 'response',
    reportProgress?: boolean,
  ): Observable<HttpResponse<GetCategoriesOutput>>
  public categoryGetCategoriesPost(
    observe?: 'events',
    reportProgress?: boolean,
  ): Observable<HttpEvent<GetCategoriesOutput>>
  public categoryGetCategoriesPost(
    observe: any = 'body',
    reportProgress: boolean = false,
  ): Observable<any> {
    let headers = this.defaultHeaders

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json']
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts)
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected)
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json']

    return this.httpClient.post<GetCategoriesOutput>(
      `${this.basePath}/category/getCategories`,
      null,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      },
    )
  }

  /**
   *
   *
   * @param body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public postCreatePostPost(
    body: CreatePostInput,
    observe?: 'body',
    reportProgress?: boolean,
  ): Observable<CreatePostOutput>
  public postCreatePostPost(
    body: CreatePostInput,
    observe?: 'response',
    reportProgress?: boolean,
  ): Observable<HttpResponse<CreatePostOutput>>
  public postCreatePostPost(
    body: CreatePostInput,
    observe?: 'events',
    reportProgress?: boolean,
  ): Observable<HttpEvent<CreatePostOutput>>
  public postCreatePostPost(
    body: CreatePostInput,
    observe: any = 'body',
    reportProgress: boolean = false,
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling postCreatePostPost.',
      )
    }

    let headers = this.defaultHeaders

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json']
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts)
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected)
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json']
    const httpContentTypeSelected:
      | string
      | undefined = this.configuration.selectHeaderContentType(consumes)
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected)
    }

    return this.httpClient.post<CreatePostOutput>(
      `${this.basePath}/post/createPost`,
      body,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      },
    )
  }

  /**
   *
   *
   * @param body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public postGetPostPost(
    body: GetPostInput,
    observe?: 'body',
    reportProgress?: boolean,
  ): Observable<GetPostOutput>
  public postGetPostPost(
    body: GetPostInput,
    observe?: 'response',
    reportProgress?: boolean,
  ): Observable<HttpResponse<GetPostOutput>>
  public postGetPostPost(
    body: GetPostInput,
    observe?: 'events',
    reportProgress?: boolean,
  ): Observable<HttpEvent<GetPostOutput>>
  public postGetPostPost(
    body: GetPostInput,
    observe: any = 'body',
    reportProgress: boolean = false,
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling postGetPostPost.',
      )
    }

    let headers = this.defaultHeaders

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json']
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts)
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected)
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json']
    const httpContentTypeSelected:
      | string
      | undefined = this.configuration.selectHeaderContentType(consumes)
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected)
    }

    return this.httpClient.post<GetPostOutput>(
      `${this.basePath}/post/getPost`,
      body,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      },
    )
  }

  /**
   *
   *
   * @param body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public postGetPostsPost(
    body: GetPostsInput,
    observe?: 'body',
    reportProgress?: boolean,
  ): Observable<GetPostsOutput>
  public postGetPostsPost(
    body: GetPostsInput,
    observe?: 'response',
    reportProgress?: boolean,
  ): Observable<HttpResponse<GetPostsOutput>>
  public postGetPostsPost(
    body: GetPostsInput,
    observe?: 'events',
    reportProgress?: boolean,
  ): Observable<HttpEvent<GetPostsOutput>>
  public postGetPostsPost(
    body: GetPostsInput,
    observe: any = 'body',
    reportProgress: boolean = false,
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling postGetPostsPost.',
      )
    }

    let headers = this.defaultHeaders

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json']
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts)
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected)
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json']
    const httpContentTypeSelected:
      | string
      | undefined = this.configuration.selectHeaderContentType(consumes)
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected)
    }

    return this.httpClient.post<GetPostsOutput>(
      `${this.basePath}/post/getPosts`,
      body,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      },
    )
  }

  /**
   *
   *
   * @param body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public postGetUserPostsPost(
    body: GetUserPostsInput,
    observe?: 'body',
    reportProgress?: boolean,
  ): Observable<GetUserPostsOutput>
  public postGetUserPostsPost(
    body: GetUserPostsInput,
    observe?: 'response',
    reportProgress?: boolean,
  ): Observable<HttpResponse<GetUserPostsOutput>>
  public postGetUserPostsPost(
    body: GetUserPostsInput,
    observe?: 'events',
    reportProgress?: boolean,
  ): Observable<HttpEvent<GetUserPostsOutput>>
  public postGetUserPostsPost(
    body: GetUserPostsInput,
    observe: any = 'body',
    reportProgress: boolean = false,
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling postGetUserPostsPost.',
      )
    }

    let headers = this.defaultHeaders

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json']
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts)
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected)
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json']
    const httpContentTypeSelected:
      | string
      | undefined = this.configuration.selectHeaderContentType(consumes)
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected)
    }

    return this.httpClient.post<GetUserPostsOutput>(
      `${this.basePath}/post/getUserPosts`,
      body,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      },
    )
  }

  /**
   *
   *
   * @param body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public replyCreateReplyPost(
    body: CreateReplyInput,
    observe?: 'body',
    reportProgress?: boolean,
  ): Observable<CreateReplyOutput>
  public replyCreateReplyPost(
    body: CreateReplyInput,
    observe?: 'response',
    reportProgress?: boolean,
  ): Observable<HttpResponse<CreateReplyOutput>>
  public replyCreateReplyPost(
    body: CreateReplyInput,
    observe?: 'events',
    reportProgress?: boolean,
  ): Observable<HttpEvent<CreateReplyOutput>>
  public replyCreateReplyPost(
    body: CreateReplyInput,
    observe: any = 'body',
    reportProgress: boolean = false,
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling replyCreateReplyPost.',
      )
    }

    let headers = this.defaultHeaders

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json']
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts)
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected)
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json']
    const httpContentTypeSelected:
      | string
      | undefined = this.configuration.selectHeaderContentType(consumes)
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected)
    }

    return this.httpClient.post<CreateReplyOutput>(
      `${this.basePath}/reply/createReply`,
      body,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      },
    )
  }

  /**
   *
   *
   * @param body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public replyGetRepliesPost(
    body: GetRepliesInput,
    observe?: 'body',
    reportProgress?: boolean,
  ): Observable<GetRepliesOutput>
  public replyGetRepliesPost(
    body: GetRepliesInput,
    observe?: 'response',
    reportProgress?: boolean,
  ): Observable<HttpResponse<GetRepliesOutput>>
  public replyGetRepliesPost(
    body: GetRepliesInput,
    observe?: 'events',
    reportProgress?: boolean,
  ): Observable<HttpEvent<GetRepliesOutput>>
  public replyGetRepliesPost(
    body: GetRepliesInput,
    observe: any = 'body',
    reportProgress: boolean = false,
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling replyGetRepliesPost.',
      )
    }

    let headers = this.defaultHeaders

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json']
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts)
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected)
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json']
    const httpContentTypeSelected:
      | string
      | undefined = this.configuration.selectHeaderContentType(consumes)
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected)
    }

    return this.httpClient.post<GetRepliesOutput>(
      `${this.basePath}/reply/getReplies`,
      body,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      },
    )
  }

  /**
   *
   *
   * @param body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public userAuthorizePost(
    body: AuthorizeInput,
    observe?: 'body',
    reportProgress?: boolean,
  ): Observable<AuthorizeOutput>
  public userAuthorizePost(
    body: AuthorizeInput,
    observe?: 'response',
    reportProgress?: boolean,
  ): Observable<HttpResponse<AuthorizeOutput>>
  public userAuthorizePost(
    body: AuthorizeInput,
    observe?: 'events',
    reportProgress?: boolean,
  ): Observable<HttpEvent<AuthorizeOutput>>
  public userAuthorizePost(
    body: AuthorizeInput,
    observe: any = 'body',
    reportProgress: boolean = false,
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling userAuthorizePost.',
      )
    }

    let headers = this.defaultHeaders

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json']
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts)
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected)
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json']
    const httpContentTypeSelected:
      | string
      | undefined = this.configuration.selectHeaderContentType(consumes)
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected)
    }

    return this.httpClient.post<AuthorizeOutput>(
      `${this.basePath}/user/authorize`,
      body,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      },
    )
  }

  /**
   *
   *
   * @param body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public userGetUsersPost(
    body: GetUsersInput,
    observe?: 'body',
    reportProgress?: boolean,
  ): Observable<GetUsersOutput>
  public userGetUsersPost(
    body: GetUsersInput,
    observe?: 'response',
    reportProgress?: boolean,
  ): Observable<HttpResponse<GetUsersOutput>>
  public userGetUsersPost(
    body: GetUsersInput,
    observe?: 'events',
    reportProgress?: boolean,
  ): Observable<HttpEvent<GetUsersOutput>>
  public userGetUsersPost(
    body: GetUsersInput,
    observe: any = 'body',
    reportProgress: boolean = false,
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling userGetUsersPost.',
      )
    }

    let headers = this.defaultHeaders

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json']
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts)
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected)
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json']
    const httpContentTypeSelected:
      | string
      | undefined = this.configuration.selectHeaderContentType(consumes)
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected)
    }

    return this.httpClient.post<GetUsersOutput>(
      `${this.basePath}/user/getUsers`,
      body,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      },
    )
  }

  /**
   *
   *
   * @param body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public userSignUpPost(
    body: SignUpInput,
    observe?: 'body',
    reportProgress?: boolean,
  ): Observable<SignUpOutput>
  public userSignUpPost(
    body: SignUpInput,
    observe?: 'response',
    reportProgress?: boolean,
  ): Observable<HttpResponse<SignUpOutput>>
  public userSignUpPost(
    body: SignUpInput,
    observe?: 'events',
    reportProgress?: boolean,
  ): Observable<HttpEvent<SignUpOutput>>
  public userSignUpPost(
    body: SignUpInput,
    observe: any = 'body',
    reportProgress: boolean = false,
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling userSignUpPost.',
      )
    }

    let headers = this.defaultHeaders

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json']
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts)
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected)
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json']
    const httpContentTypeSelected:
      | string
      | undefined = this.configuration.selectHeaderContentType(consumes)
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected)
    }

    return this.httpClient.post<SignUpOutput>(
      `${this.basePath}/user/signUp`,
      body,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      },
    )
  }

  /**
   *
   *
   * @param body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public userUpdateUserPost(
    body: UpdateUserInput,
    observe?: 'body',
    reportProgress?: boolean,
  ): Observable<any>
  public userUpdateUserPost(
    body: UpdateUserInput,
    observe?: 'response',
    reportProgress?: boolean,
  ): Observable<HttpResponse<any>>
  public userUpdateUserPost(
    body: UpdateUserInput,
    observe?: 'events',
    reportProgress?: boolean,
  ): Observable<HttpEvent<any>>
  public userUpdateUserPost(
    body: UpdateUserInput,
    observe: any = 'body',
    reportProgress: boolean = false,
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling userUpdateUserPost.',
      )
    }

    let headers = this.defaultHeaders

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json']
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts)
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected)
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json']
    const httpContentTypeSelected:
      | string
      | undefined = this.configuration.selectHeaderContentType(consumes)
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected)
    }

    return this.httpClient.post<any>(`${this.basePath}/user/updateUser`, body, {
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress,
    })
  }
}
