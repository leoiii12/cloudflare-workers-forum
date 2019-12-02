import { Project } from 'ts-morph'

import { IEnumDef } from './enumDef'
import { IPropertyDef } from './propertyDef'
import { IRouteDef } from './routeDef'
import { SwaggerUtils } from './swaggerUtils'
import { OpenApiV3 } from './openApi'

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
        (pv, cv) => pv.concat(cv.outputProperties),
        [] as Array<{ name: string; decorators: string[]; type: string }>,
      )
      .map(p => p.type)
      .filter(type => type.startsWith('import'))
      .forEach(typeFullPath => {
        const type = this.lookUpType(this.project, typeFullPath)
        if (type === undefined) {
          return
        }

        this.referenceTypes[typeFullPath] = type
      })
  }

  private getRouteDefs() {
    return this.routeDefs.map(rd => {
      rd.outputProperties = rd.outputProperties.map(op => {
        op.arrayDepth = op.type.split('[]').length - 1
        op.type = op.type.replace(/\[\]/g, '')

        return op
      })

      rd.inputProperties = rd.inputProperties.map(op => {
        op.arrayDepth = op.type.split('[]').length - 1
        op.type = op.type.replace(/\[\]/g, '')

        return op
      })

      return rd
    })
  }

  private lookUpType(
    project: Project,
    typeFullPath: string,
  ): IEnumDef | IPropertyDef[] {
    if (Object.keys(this.referenceTypes).includes(typeFullPath)) {
      return this.referenceTypes[typeFullPath]
    }

    const { importPath, className } = SwaggerUtils.getTypeFullPath(typeFullPath)

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
