import {
  ClassDeclaration,
  Project,
  SyntaxKind,
  VariableDeclaration,
  ObjectLiteralExpression,
  Identifier,
  StringLiteral,
  ArrayLiteralExpression,
} from 'ts-morph'

import { IPropertyDef } from './propertyDef'
import { IRouteDef } from './routeDef'

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

  public static getPlainRouteDefs(project: Project) {
    const routeDefs: IRouteDef[] = []

    const sourceFiles = project.getSourceFiles('./src/func/*/index.ts')

    sourceFiles.forEach(sourceFile => {
      sourceFile.forEachDescendant(node => {
        switch (node.getKind()) {
          case SyntaxKind.VariableDeclaration:
            const variableDecl = node as VariableDeclaration
            const variableDeclChildren = variableDecl.forEachChildAsArray()

            // Is a Route Module
            if (
              variableDeclChildren.length !== 3 ||
              variableDeclChildren[0].getKind() !== SyntaxKind.Identifier ||
              variableDeclChildren[1].getKind() !== SyntaxKind.TypeReference ||
              variableDeclChildren[1].getText() !== 'IRouteModule' ||
              variableDeclChildren[2].getKind() !==
                SyntaxKind.ObjectLiteralExpression
            ) {
              return
            }

            // Routes
            const objectLiteralExpression = variableDeclChildren[2] as ObjectLiteralExpression
            objectLiteralExpression.forEachChild(
              routeObjectPropertyAssignment => {
                const children = routeObjectPropertyAssignment.forEachChildAsArray()

                if (
                  children.length !== 2 ||
                  children[0].getKind() !== SyntaxKind.Identifier ||
                  children[1].getKind() !== SyntaxKind.ObjectLiteralExpression
                ) {
                  return
                }

                const routeNameIdentifier = children[0] as Identifier
                const routeObjectLiteralExpression = children[1] as ObjectLiteralExpression

                // Is a Route
                const propertyAssignments = routeObjectLiteralExpression.getChildrenOfKind(
                  SyntaxKind.PropertyAssignment,
                )
                if (propertyAssignments.length !== 5) {
                  return
                }

                const routeDef = {
                  name: routeNameIdentifier.getText(),
                  path: '',
                  methods: [] as string[],
                  inputProperties: [] as IPropertyDef[],
                  outputProperties: [] as IPropertyDef[],
                }

                // Handle the Route
                for (const propertyAssignment of propertyAssignments) {
                  const children = propertyAssignment.forEachChildAsArray()
                  const keyIdentifier = children[0] as Identifier
                  const valueLiteral = children[1]

                  switch (keyIdentifier.getText()) {
                    case 'path':
                      routeDef.path = (valueLiteral as StringLiteral).getLiteralValue()
                      break
                    case 'methods':
                      routeDef.methods = (valueLiteral as ArrayLiteralExpression)
                        .forEachChildAsArray()
                        .map(c => (c as StringLiteral).getLiteralValue())
                      break
                    case 'input':
                      ;(valueLiteral as Identifier)
                        .getDefinitions()
                        .forEach(definition => {
                          const classDeclaration = definition
                            .getNode()
                            .getParentOrThrow() as ClassDeclaration

                          routeDef.inputProperties = SwaggerUtils.getClassProperties(
                            classDeclaration,
                          )
                        })

                      break
                    case 'output':
                      ;(valueLiteral as Identifier)
                        .getDefinitions()
                        .forEach(definition => {
                          const classDeclaration = definition
                            .getNode()
                            .getParentOrThrow() as ClassDeclaration

                          routeDef.outputProperties = SwaggerUtils.getClassProperties(
                            classDeclaration,
                          )
                        })

                      break
                  }
                }

                routeDefs.push(routeDef)
              },
            )

            break
        }
      })
    })

    return routeDefs
  }
}
