/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The transfer protocol of the API.
 *
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "schemesList".
 */
export type SchemesList = ('http' | 'https' | 'ws' | 'wss')[]
/**
 * The MIME type of the HTTP message.
 *
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "mimeType".
 */
export type MimeType = string
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "mediaTypeList".
 */
export type MediaTypeList = MimeType[]
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "parameter".
 */
export type Parameter = BodyParameter | NonBodyParameter
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "title".
 */
export type Title = string
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "description".
 */
export type Description = string
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "default".
 */
export type Default = any
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "multipleOf".
 */
export type MultipleOf = number
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "maximum".
 */
export type Maximum = number
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "exclusiveMaximum".
 */
export type ExclusiveMaximum = boolean
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "minimum".
 */
export type Minimum = number
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "exclusiveMinimum".
 */
export type ExclusiveMinimum = boolean
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "maxLength".
 *
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "maxItems".
 */
export type MaxLength = number
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "minLength".
 *
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "minItems".
 */
export type MinLength = MaxLength
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "pattern".
 */
export type Pattern = string
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "uniqueItems".
 */
export type UniqueItems = boolean
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "enum".
 */
export type Enum = [any, ...any[]]
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "nonBodyParameter".
 */
export type NonBodyParameter =
  | HeaderParameterSubSchema
  | FormDataParameterSubSchema
  | QueryParameterSubSchema
  | PathParameterSubSchema
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "collectionFormat".
 */
export type CollectionFormat = 'csv' | 'ssv' | 'tsv' | 'pipes'
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "collectionFormatWithMulti".
 */
export type CollectionFormatWithMulti =
  | 'csv'
  | 'ssv'
  | 'tsv'
  | 'pipes'
  | 'multi'
/**
 * The parameters needed to send a valid API call.
 *
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "parametersList".
 */
export type ParametersList = (Parameter | JsonReference)[]
/**
 * This interface was referenced by `Responses`'s JSON-Schema definition
 * via the `patternProperty` "^([0-9]{3})$|^(default)$".
 *
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "responseValue".
 */
export type ResponseValue = Response | JsonReference
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "security".
 */
export type Security = SecurityRequirement[]

export interface SwaggerDocV2 {
  /**
   * The Swagger version of this document.
   */
  swagger: '2.0'
  info: Info
  /**
   * The host (name or ip) of the API. Example: 'swagger.io'
   */
  host?: string
  /**
   * The base path to the API. Example: '/api'.
   */
  basePath?: string
  schemes?: SchemesList
  /**
   * A list of MIME types accepted by the API.
   */
  consumes?: MediaTypeList
  /**
   * A list of MIME types the API can produce.
   */
  produces?: MediaTypeList
  paths: Paths
  definitions?: Definitions
  parameters?: ParameterDefinitions
  responses?: ResponseDefinitions
  security?: Security
  securityDefinitions?: SecurityDefinitions
  tags?: Tag[]
  externalDocs?: ExternalDocs
}
/**
 * General information about the API.
 *
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "info".
 */
export interface Info {
  /**
   * A unique and precise title of the API.
   */
  title: string
  /**
   * A semantic version number of the API.
   */
  version: string
  /**
   * A longer description of the API. Should be different from the title.  GitHub Flavored Markdown is allowed.
   */
  description?: string
  /**
   * The terms of service for the API.
   */
  termsOfService?: string
  contact?: Contact
  license?: License
}
/**
 * Contact information for the owners of the API.
 *
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "contact".
 */
export interface Contact {
  /**
   * The identifying name of the contact person/organization.
   */
  name?: string
  /**
   * The URL pointing to the contact information.
   */
  url?: string
  /**
   * The email address of the contact person/organization.
   */
  email?: string
}
/**
 * Any property starting with x- is valid.
 *
 * This interface was referenced by `Contact`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `License`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `Info`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `Paths`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `ExternalDocs`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `Xml`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `Schema`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `BodyParameter`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `PrimitivesItems`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `HeaderParameterSubSchema`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `FormDataParameterSubSchema`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `QueryParameterSubSchema`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `PathParameterSubSchema`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `FileSchema`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `Header`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `Response`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `Responses`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `Operation`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `PathItem`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `BasicAuthenticationSecurity`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `ApiKeySecurity`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `Oauth2ImplicitSecurity`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `Oauth2PasswordSecurity`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `Oauth2ApplicationSecurity`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `Oauth2AccessCodeSecurity`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `Tag`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema definition
 * via the `patternProperty` "^x-".
 *
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "vendorExtension".
 */
export interface VendorExtension {
  [k: string]: any | undefined
}
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "license".
 */
export interface License {
  /**
   * The name of the license type. It's encouraged to use an OSI compatible license.
   */
  name: string
  /**
   * The URL pointing to the license.
   */
  url?: string
}
/**
 * Relative paths to the individual endpoints. They must be relative to the 'basePath'.
 *
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "paths".
 */
export interface Paths {}
/**
 * This interface was referenced by `Paths`'s JSON-Schema definition
 * via the `patternProperty` "^/".
 *
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "pathItem".
 */
export interface PathItem {
  $ref?: string
  get?: Operation
  put?: Operation
  post?: Operation
  delete?: Operation
  options?: Operation
  head?: Operation
  patch?: Operation
  parameters?: ParametersList
}
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "operation".
 */
export interface Operation {
  tags?: string[]
  /**
   * A brief summary of the operation.
   */
  summary?: string
  /**
   * A longer description of the operation, GitHub Flavored Markdown is allowed.
   */
  description?: string
  externalDocs?: ExternalDocs
  /**
   * A unique identifier of the operation.
   */
  operationId?: string
  /**
   * A list of MIME types the API can produce.
   */
  produces?: MediaTypeList
  /**
   * A list of MIME types the API can consume.
   */
  consumes?: MediaTypeList
  parameters?: ParametersList
  responses: Responses
  schemes?: SchemesList
  deprecated?: boolean
  security?: Security
}
/**
 * information about external documentation
 *
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "externalDocs".
 */
export interface ExternalDocs {
  description?: string
  url: string
}
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "bodyParameter".
 */
export interface BodyParameter {
  /**
   * A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.
   */
  description?: string
  /**
   * The name of the parameter.
   */
  name: string
  /**
   * Determines the location of the parameter.
   */
  in: 'body'
  /**
   * Determines whether or not this parameter is required or optional.
   */
  required?: boolean
  schema: Schema
}
/**
 * A deterministic version of a JSON Schema object.
 *
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "schema".
 */
export interface Schema {
  $ref?: string
  format?: string
  title?: Title
  description?: Description
  default?: Default
  multipleOf?: MultipleOf
  maximum?: Maximum
  exclusiveMaximum?: ExclusiveMaximum
  minimum?: Minimum
  exclusiveMinimum?: ExclusiveMinimum
  maxLength?: MaxLength
  minLength?: MinLength
  pattern?: Pattern
  maxItems?: MaxLength
  minItems?: MinLength
  uniqueItems?: UniqueItems
  maxProperties?: MaxLength
  minProperties?: MinLength
  required?: string[]
  enum?: Enum
  additionalProperties?: Schema | boolean
  type?:
    | (
        | 'array'
        | 'boolean'
        | 'integer'
        | 'null'
        | 'number'
        | 'object'
        | 'string'
      )
    | (
        | 'array'
        | 'boolean'
        | 'integer'
        | 'null'
        | 'number'
        | 'object'
        | 'string'
      )[]
  items?: Schema | [Schema, ...Schema[]]
  allOf?: [Schema, ...Schema[]]
  properties?: {
    [k: string]: Schema
  }
  discriminator?: string
  readOnly?: boolean
  xml?: Xml
  externalDocs?: ExternalDocs
  example?: any
}
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "xml".
 */
export interface Xml {
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
}
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "headerParameterSubSchema".
 */
export interface HeaderParameterSubSchema {
  /**
   * Determines whether or not this parameter is required or optional.
   */
  required?: boolean
  /**
   * Determines the location of the parameter.
   */
  in?: 'header'
  /**
   * A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.
   */
  description?: string
  /**
   * The name of the parameter.
   */
  name?: string
  type?: 'string' | 'number' | 'boolean' | 'integer' | 'array'
  format?: string
  items?: PrimitivesItems
  collectionFormat?: CollectionFormat
  default?: Default
  maximum?: Maximum
  exclusiveMaximum?: ExclusiveMaximum
  minimum?: Minimum
  exclusiveMinimum?: ExclusiveMinimum
  maxLength?: MaxLength
  minLength?: MinLength
  pattern?: Pattern
  maxItems?: MaxLength
  minItems?: MinLength
  uniqueItems?: UniqueItems
  enum?: Enum
  multipleOf?: MultipleOf
}
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "primitivesItems".
 */
export interface PrimitivesItems {
  type?: 'string' | 'number' | 'integer' | 'boolean' | 'array'
  format?: string
  items?: PrimitivesItems
  collectionFormat?: CollectionFormat
  default?: Default
  maximum?: Maximum
  exclusiveMaximum?: ExclusiveMaximum
  minimum?: Minimum
  exclusiveMinimum?: ExclusiveMinimum
  maxLength?: MaxLength
  minLength?: MinLength
  pattern?: Pattern
  maxItems?: MaxLength
  minItems?: MinLength
  uniqueItems?: UniqueItems
  enum?: Enum
  multipleOf?: MultipleOf
}
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "formDataParameterSubSchema".
 */
export interface FormDataParameterSubSchema {
  /**
   * Determines whether or not this parameter is required or optional.
   */
  required?: boolean
  /**
   * Determines the location of the parameter.
   */
  in?: 'formData'
  /**
   * A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.
   */
  description?: string
  /**
   * The name of the parameter.
   */
  name?: string
  /**
   * allows sending a parameter by name only or with an empty value.
   */
  allowEmptyValue?: boolean
  type?: 'string' | 'number' | 'boolean' | 'integer' | 'array' | 'file'
  format?: string
  items?: PrimitivesItems
  collectionFormat?: CollectionFormatWithMulti
  default?: Default
  maximum?: Maximum
  exclusiveMaximum?: ExclusiveMaximum
  minimum?: Minimum
  exclusiveMinimum?: ExclusiveMinimum
  maxLength?: MaxLength
  minLength?: MinLength
  pattern?: Pattern
  maxItems?: MaxLength
  minItems?: MinLength
  uniqueItems?: UniqueItems
  enum?: Enum
  multipleOf?: MultipleOf
}
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "queryParameterSubSchema".
 */
export interface QueryParameterSubSchema {
  /**
   * Determines whether or not this parameter is required or optional.
   */
  required?: boolean
  /**
   * Determines the location of the parameter.
   */
  in?: 'query'
  /**
   * A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.
   */
  description?: string
  /**
   * The name of the parameter.
   */
  name?: string
  /**
   * allows sending a parameter by name only or with an empty value.
   */
  allowEmptyValue?: boolean
  type?: 'string' | 'number' | 'boolean' | 'integer' | 'array'
  format?: string
  items?: PrimitivesItems
  collectionFormat?: CollectionFormatWithMulti
  default?: Default
  maximum?: Maximum
  exclusiveMaximum?: ExclusiveMaximum
  minimum?: Minimum
  exclusiveMinimum?: ExclusiveMinimum
  maxLength?: MaxLength
  minLength?: MinLength
  pattern?: Pattern
  maxItems?: MaxLength
  minItems?: MinLength
  uniqueItems?: UniqueItems
  enum?: Enum
  multipleOf?: MultipleOf
}
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "pathParameterSubSchema".
 */
export interface PathParameterSubSchema {
  /**
   * Determines whether or not this parameter is required or optional.
   */
  required: true
  /**
   * Determines the location of the parameter.
   */
  in?: 'path'
  /**
   * A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.
   */
  description?: string
  /**
   * The name of the parameter.
   */
  name?: string
  type?: 'string' | 'number' | 'boolean' | 'integer' | 'array'
  format?: string
  items?: PrimitivesItems
  collectionFormat?: CollectionFormat
  default?: Default
  maximum?: Maximum
  exclusiveMaximum?: ExclusiveMaximum
  minimum?: Minimum
  exclusiveMinimum?: ExclusiveMinimum
  maxLength?: MaxLength
  minLength?: MinLength
  pattern?: Pattern
  maxItems?: MaxLength
  minItems?: MinLength
  uniqueItems?: UniqueItems
  enum?: Enum
  multipleOf?: MultipleOf
}
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "jsonReference".
 */
export interface JsonReference {
  $ref: string
}
/**
 * Response objects names can either be any valid HTTP status code or 'default'.
 *
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "responses".
 */
export interface Responses {}
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "response".
 */
export interface Response {
  description: string
  schema?: Schema | FileSchema
  headers?: Headers
  examples?: Examples
}
/**
 * A deterministic version of a JSON Schema object.
 *
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "fileSchema".
 */
export interface FileSchema {
  format?: string
  title?: Title
  description?: Description
  default?: Default
  required?: string[]
  type: 'file'
  readOnly?: boolean
  externalDocs?: ExternalDocs
  example?: any
}
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "headers".
 */
export interface Headers {
  [k: string]: Header
}
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "header".
 */
export interface Header {
  type: 'string' | 'number' | 'integer' | 'boolean' | 'array'
  format?: string
  items?: PrimitivesItems
  collectionFormat?: CollectionFormat
  default?: Default
  maximum?: Maximum
  exclusiveMaximum?: ExclusiveMaximum
  minimum?: Minimum
  exclusiveMinimum?: ExclusiveMinimum
  maxLength?: MaxLength
  minLength?: MinLength
  pattern?: Pattern
  maxItems?: MaxLength
  minItems?: MinLength
  uniqueItems?: UniqueItems
  enum?: Enum
  multipleOf?: MultipleOf
  description?: string
}
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "examples".
 */
export interface Examples {
  [k: string]: any | undefined
}
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "securityRequirement".
 */
export interface SecurityRequirement {
  [k: string]: string[] | undefined
}
/**
 * One or more JSON objects describing the schemas being consumed and produced by the API.
 *
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "definitions".
 */
export interface Definitions {
  [k: string]: Schema
}
/**
 * One or more JSON representations for parameters
 *
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "parameterDefinitions".
 */
export interface ParameterDefinitions {
  [k: string]: Parameter
}
/**
 * One or more JSON representations for responses
 *
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "responseDefinitions".
 */
export interface ResponseDefinitions {
  [k: string]: Response
}
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "securityDefinitions".
 */
export interface SecurityDefinitions {
  [k: string]:
    | (
        | BasicAuthenticationSecurity
        | ApiKeySecurity
        | Oauth2ImplicitSecurity
        | Oauth2PasswordSecurity
        | Oauth2ApplicationSecurity
        | Oauth2AccessCodeSecurity
      )
    | undefined
}
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "basicAuthenticationSecurity".
 */
export interface BasicAuthenticationSecurity {
  type: 'basic'
  description?: string
}
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "apiKeySecurity".
 */
export interface ApiKeySecurity {
  type: 'apiKey'
  name: string
  in: 'header' | 'query'
  description?: string
}
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "oauth2ImplicitSecurity".
 */
export interface Oauth2ImplicitSecurity {
  type: 'oauth2'
  flow: 'implicit'
  scopes?: Oauth2Scopes
  authorizationUrl: string
  description?: string
}
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "oauth2Scopes".
 */
export interface Oauth2Scopes {
  [k: string]: string | undefined
}
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "oauth2PasswordSecurity".
 */
export interface Oauth2PasswordSecurity {
  type: 'oauth2'
  flow: 'password'
  scopes?: Oauth2Scopes
  tokenUrl: string
  description?: string
}
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "oauth2ApplicationSecurity".
 */
export interface Oauth2ApplicationSecurity {
  type: 'oauth2'
  flow: 'application'
  scopes?: Oauth2Scopes
  tokenUrl: string
  description?: string
}
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "oauth2AccessCodeSecurity".
 */
export interface Oauth2AccessCodeSecurity {
  type: 'oauth2'
  flow: 'accessCode'
  scopes?: Oauth2Scopes
  authorizationUrl: string
  tokenUrl: string
  description?: string
}
/**
 * This interface was referenced by `SwaggerDocV2`'s JSON-Schema
 * via the `definition` "tag".
 */
export interface Tag {
  name: string
  description?: string
  externalDocs?: ExternalDocs
}
