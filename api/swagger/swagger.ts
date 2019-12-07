import { Project } from 'ts-morph'

import { IEnumDef } from './enumDef'
import { IPropertyDef } from './propertyDef'
import { IRouteDef } from './routeDef'
import {
  BodyParameter,
  Definitions,
  Operation,
  PathItem,
  Schema,
  SwaggerDocV2,
} from './swaggerDoc'
import { SwaggerUtils } from './swaggerUtils'
import { TypeHolder } from './typeHolder'

export class Swagger {
  public infoTitle = 'MySwaggerDoc'
  public infoVersion = '1.0.0'
  public host = 'forum-api.lecom.cloud'

  private project: Project

  private typeHolder: TypeHolder = new TypeHolder()
  private routeDefs: IRouteDef[]

  constructor() {
    this.project = new Project({
      tsConfigFilePath: './tsconfig.json',
    })

    this.routeDefs = SwaggerUtils.getPlainRouteDefs(this.project)

    this.typeHolder.populateTypes(
      this.project,
      this.routeDefs
        .reduce((agg, cv) => {
          return agg.concat(cv.inputType).concat(cv.outputType)
        }, [] as Array<string | undefined>)
        .filter(type => type !== undefined && type.startsWith('import'))
        .map(type => type as string),
    )
  }

  public getSwaggerDoc(): SwaggerDocV2 {
    const paths = this.routeDefs
      .map(routeDef => {
        const pathItem: PathItem = {}

        for (const method of routeDef.methods) {
          const ref =
            routeDef.outputType !== undefined
              ? `#/definitions/${
                  SwaggerUtils.parseTypeFullPath(routeDef.outputType).typeName
                }`
              : undefined
          const operation: Operation = {
            operationId: `${routeDef.path}_${method}`,
            produces: ['application/json'],
            consumes: ['application/json'],
            parameters: [],
            responses: {
              200: {
                $ref: ref,
              },
            },
          }

          if (routeDef.inputType !== undefined) {
            const ref = `#/definitions/${
              SwaggerUtils.parseTypeFullPath(routeDef.inputType).typeName
            }`
            const parameter: BodyParameter = {
              in: 'body',
              name: 'body',
              required: true,
              schema: {
                $ref: ref,
              },
            }
            if (operation.parameters !== undefined) {
              operation.parameters.push(parameter)
            }
          }

          pathItem[method] = operation
        }

        return { path: routeDef.path, pathItem }
      })
      .reduce(
        (agg, cv) => {
          agg[cv.path] = cv.pathItem
          return agg
        },
        // tslint:disable-next-line: no-object-literal-type-assertion
        {} as { [path: string]: PathItem },
      )

    const definitions: Definitions = this.typeHolder
      .getIndexedTypeNames()
      .map(typeFullName => {
        const { typeName } = SwaggerUtils.parseTypeFullPath(typeFullName)
        const referenceType = this.typeHolder.lookUpType(
          this.project,
          typeFullName,
        )

        if (Array.isArray(referenceType)) {
          const definition: Schema = {
            type: 'object',
            properties: referenceType.reduce(
              (agg, cv) => {
                switch (cv.type) {
                  case 'boolean':
                  case 'number':
                  case 'string':
                    agg[cv.name] = { type: cv.type }
                    break
                  default:
                    if (cv.type.startsWith('import')) {
                      const { typeName } = SwaggerUtils.parseTypeFullPath(
                        cv.type,
                      )
                      agg[cv.name] = { $ref: `#/definitions/${typeName}` }
                    } else {
                      throw new Error(
                        `An undefined type is found for ${typeName}`,
                      )
                    }

                    break
                }

                return agg
              },
              // tslint:disable-next-line: no-object-literal-type-assertion
              {} as { [k: string]: Schema },
            ),
          }

          return { typeName, definition }
        } else if (referenceType.t === 'IEnumDef') {
          const definition: Schema = {
            type: 'number',
            enum: Object.values((referenceType as IEnumDef).values) as any,
          }

          return { typeName, definition }
        }

        throw new Error(`Not yet handled this kind of reference types.`)
      })
      .reduce(
        (agg, cv) => {
          agg[cv.typeName] = cv.definition
          return agg
        },
        // tslint:disable-next-line: no-object-literal-type-assertion
        {} as Definitions,
      )

    const swaggerDocV2: SwaggerDocV2 = {
      swagger: '2.0',
      info: {
        title: this.infoTitle,
        version: this.infoVersion,
      },
      paths,
      host: this.host,
      schemes: ['https'],
      definitions: definitions,
    }

    return swaggerDocV2
  }
}
