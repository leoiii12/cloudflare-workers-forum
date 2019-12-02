import { Project } from 'ts-morph'

import { IEnumDef } from './enumDef'
import { IPropertyDef } from './propertyDef'
import { IRouteDef } from './routeDef'
import { SwaggerUtils } from './swaggerUtils'
import { SwaggerDocV2, Operation, PathItem } from './swaggerDoc'

export class Swagger {
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
    const paths: { [path: string]: PathItem } = {}

    for (const routeDef of this.routeDefs) {
      const pathItem: PathItem = {}

      for (const method of routeDef.methods) {
        const operation: Operation = {
          operationId: `${routeDef.path}_${method}`,
          produces: ['application/json'],
          consumes: ['application/json'],
          parameters: [],
          responses: {
            200: {
              description: 'Success',
              $ref:
                routeDef.outputType !== undefined
                  ? `#/definitions/${
                      SwaggerUtils.parseTypeFullPath(routeDef.outputType)
                        .className
                    }`
                  : undefined,
            },
          },
        }

        if (routeDef.inputType !== undefined) {
          const parameter = {
            in: 'body',
            name: 'body',
            required: true,
            schema: {
              $ref: `#/definitions/${
                SwaggerUtils.parseTypeFullPath(routeDef.inputType).className
              }`,
            },
          }
          ;(operation.parameters as any).push(parameter)
        }

        pathItem[method] = operation
      }

      paths[routeDef.path] = pathItem
    }

    const infoTitle = 'MySwaggerDoc'
    const infoVersion = '1.0.0'
    const host = 'forum-api.lecom.cloud'

    const swaggerDocV2: SwaggerDocV2 = {
      swagger: '2.0',
      info: {
        title: infoTitle,
        version: infoVersion,
      },
      paths,
      host,
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

    const { importPath, className } = SwaggerUtils.parseTypeFullPath(
      typeFullPath,
    )

    const sourceFile = project.getSourceFile(`${importPath}.ts`)
    if (sourceFile === undefined) {
      throw new Error(
        `Can't locate the source file with typeFullPath=[${typeFullPath}]`,
      )
    }

    const classDeclaration = sourceFile.getClass(className.replace(/\[\]/g, ''))
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

    const enumDeclaration = sourceFile.getEnum(className.replace(/\[\]/g, ''))
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
