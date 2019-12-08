import { Project } from 'ts-morph'

import { IEnumDef } from './enumDef'
import { IPropertyDef } from './propertyDef'
import { SwaggerUtils } from './swaggerUtils'

export class TypeHolder {
  private referenceTypes: {
    [typeFullPath: string]: IPropertyDef[] | IEnumDef
  } = {}

  public getIndexedTypeNames() {
    return Object.keys(this.referenceTypes)
  }

  public populateTypes(project: Project, typeFullPaths: string[]) {
    for (const typeFullPath of typeFullPaths) {
      this.referenceTypes[typeFullPath] = this.lookUpType(project, typeFullPath)
    }
  }

  public lookUpType(
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

      // This is not good, Recursion + States
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

      const enumDef: IEnumDef = { t: 'IEnumDef', values: {} }
      for (const enumValue of enumValues) {
        if (enumValue === undefined) {
          throw new Error('Enums does not allow undefined value.')
        }
        enumDef.values[enumValue.name] = enumValue.value as string | number
      }

      return enumDef
    }

    throw new Error(`The type=[${typeFullPath}] can't be found.`)
  }
}
