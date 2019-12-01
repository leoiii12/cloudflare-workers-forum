import { ClassDeclaration } from 'ts-morph'

import { IPropertyDef } from './propertyDef'

export class SwaggerUtils {
  public static getTypeFullPath(
    typeImportPath: string,
  ): { importPath: string; className: string } {
    const arr = new RegExp(/import\("(.*?)\"\).(.*)/).exec(typeImportPath)
    if (arr === null) {
      throw new Error(`The typeImportPath=[${typeImportPath}] is invalid.`)
    }

    return {
      importPath: arr[1],
      className: arr[2],
    }
  }

  public static getClassProperties(
    classDeclaration: ClassDeclaration,
  ): IPropertyDef[] {
    const instanceMembers = classDeclaration.getInstanceMembers()

    const properties = []
    for (const instanceMember of instanceMembers) {
      const type = instanceMember.getType()

      const property: IPropertyDef = {
        decorators: instanceMember.getDecorators().map(d => d.getText()),
        name: instanceMember.getName(),
        type: type
          .getNonNullableType()
          .getText()
          .replace(/\[\]/g, ''),
        arrayDepth: type.getText().split('[]').length - 1,
        isNullableOrUndefined:
          type.getNonNullableType().getText() !== type.getText(),
      }
      properties.push(property)
    }

    return properties
  }
}
