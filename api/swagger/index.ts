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

import { IRouteDef } from './routeDef'

const project = new Project({
  tsConfigFilePath: './tsconfig.json',
})

const routeDefs = getRouteDefs(project)

routeDefs.forEach(routeDef => {
  console.log(routeDef)
})

const types = routeDefs
  .reduce(
    (pv, cv) => pv.concat(cv.outputProperties),
    [] as Array<{ name: string; decorators: string[]; type: string }>,
  )
  .map(p => p.type)
  .filter(type => type.startsWith('import'))

const regExp = new RegExp(/import\("(.*?)\"\).(.*)/)
types.forEach(ic => {
  const arr = regExp.exec(ic)
  if (arr === null) {
    return
  }

  const importPath = arr[1]
  const className = arr[2].replace('[]', '')

  const sourceFile = project.getSourceFile(`${importPath}.ts`)
  if (sourceFile === undefined) {
    return
  }

  const classDeclaration = sourceFile.getClassOrThrow(className)
  console.log(getClassProperties(classDeclaration))
})

function getRouteDefs(project: Project) {
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
                inputProperties: [] as Array<{
                  name: string
                  decorators: string[]
                  type: string
                }>,
                outputProperties: [] as Array<{
                  name: string
                  decorators: string[]
                  type: string
                }>,
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

                        routeDef.inputProperties = getClassProperties(
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

                        routeDef.outputProperties = getClassProperties(
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

function getClassProperties(classDeclaration: ClassDeclaration) {
  const propertyDeclarations = classDeclaration.getInstanceMembers()

  const properties = []
  for (const propertyDeclaration of propertyDeclarations) {
    const property = {
      decorators: propertyDeclaration.getDecorators().map(d => d.getText()),
      name: propertyDeclaration.getName(),
      type: propertyDeclaration.getType().getText(),
    }
    properties.push(property)
  }

  return properties
}
