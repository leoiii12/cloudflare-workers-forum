import { Project } from 'ts-morph'

import { IEnumDef } from './enumDef'
import { IPropertyDef } from './propertyDef'
import { IRouteDef } from './routeDef'
import { SwaggerUtils } from './swaggerUtils'
import {
  SwaggerDocV2,
  Operation,
  PathItem,
  BodyParameter,
  Definitions,
} from './swaggerDoc'
import { type } from 'os'

export class Swagger {
  public infoTitle = 'MySwaggerDoc'
  public infoVersion = '1.0.0'
  public host = 'forum-api.lecom.cloud'

  public project: Project

  private referenceTypes: {
    [typeFullPath: string]: IPropertyDef[] | IEnumDef
  } = {}
  private routeDefs: IRouteDef[]

  constructor() {
    this.project = new Project({
      tsConfigFilePath: './tsconfig.json',
    })

    this.routeDefs = SwaggerUtils.getPlainRouteDefs(this.project)

    this.routeDefs
      .reduce(
        (pv, cv) => pv.concat(cv.outputType),
        [] as Array<string | undefined>,
      )
      .filter(type => type !== undefined && type.startsWith('import'))
      .map(type => type as string)
      .forEach(typeFullPath => {
        const type = this.lookUpType(this.project, typeFullPath)
        if (type === undefined) {
          return
        }

        this.referenceTypes[typeFullPath] = type
      })
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
                description: 'Success',
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

    const definitions: Definitions = {}

    Object.keys(this.referenceTypes).map(typeFullName => {
      const { typeName } = SwaggerUtils.parseTypeFullPath(typeFullName)
      const properties = this.referenceTypes[typeFullName]
    })

    const swaggerDocV2: SwaggerDocV2 = {
      swagger: '2.0',
      info: {
        title: this.infoTitle,
        version: this.infoVersion,
      },
      paths,
      host: this.host,
      schemes: ['https'],
    }

    return swaggerDocV2
  }

  private lookUpType(
    project: Project,
    typeFullPath: string,
  ): IEnumDef | IPropertyDef[] {
    if (Object.keys(this.referenceTypes).includes(typeFullPath)) {
      return this.referenceTypes[typeFullPath]
    }

    const { importPath, typeName } = SwaggerUtils.parseTypeFullPath(
      typeFullPath,
    )

    const sourceFile = project.getSourceFile(`${importPath}.ts`)
    if (sourceFile === undefined) {
      throw new Error(
        `Can't locate the source file with typeFullPath=[${typeFullPath}]`,
      )
    }

    const classDeclaration = sourceFile.getClass(typeName.replace(/\[\]/g, ''))
    if (classDeclaration !== undefined) {
      const classProperties = SwaggerUtils.getClassProperties(classDeclaration)

      // This is not good
      const importingTypes = classProperties.filter(cp =>
        cp.type.startsWith('import'),
      )
      for (const importingType of importingTypes) {
        this.referenceTypes[importingType.type] = this.lookUpType(
          project,
          importingType.type,
        )
      }

      return classProperties
    }

    const enumDeclaration = sourceFile.getEnum(typeName.replace(/\[\]/g, ''))
    if (enumDeclaration !== undefined) {
      const enumValues = enumDeclaration.getMembers().map(m => {
        return { name: m.getName(), value: m.getValue() }
      })

      const enumDef: IEnumDef = {}
      for (const enumValue of enumValues) {
        if (enumValue === undefined) {
          throw new Error('Enums does not allow undefined value.')
        }
        enumDef[enumValue.name] = enumValue.value as string | number
      }

      return enumDef
    }

    throw new Error()
  }
}
