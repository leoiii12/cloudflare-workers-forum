import {
  ArrayLiteralExpression,
  ClassDeclaration,
  Identifier,
  ObjectLiteralExpression,
  Project,
  StringLiteral,
  SyntaxKind,
  VariableDeclaration,
} from 'ts-morph'

import { IEnumDef } from './enumDef'
import { IPropertyDef } from './propertyDef'
import { IRouteDef } from './routeDef'
import { SwaggerUtils } from './swaggerUtils'

export class Swagger {
  private static getRouteDefs(project: Project) {
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

  public project: Project
  public referenceTypes: {
    [typeFullPath: string]: IPropertyDef[] | IEnumDef
  } = {}
  private routeDefs: IRouteDef[]

  constructor() {
    this.project = new Project({
      tsConfigFilePath: './tsconfig.json',
    })

    this.routeDefs = Swagger.getRouteDefs(this.project)

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

  public getRouteDefs() {
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
      enumDeclaration.getMembers().map(m => {
        m.getValue()
      })

      return {} as IEnumDef
    }

    throw new Error()
  }
}
