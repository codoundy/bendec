import * as fs from 'fs'
import { TypeDefinition } from '../'

const getMembers = fields => {

  return fields.map(field => {

    // TODO: make this configurable
    const theType = (field.type == 'char' && field.length > 0)
      ? 'Buffer'
      : field.type
    
    return `  ${field.name}: ${theType}`
  })
}

/**
 * Generate TypeScript interfaces from Bender types definitions
 */
export const generate = (types: any[], fileName: string) => {

  const declarations = types.map(benderTypeDef => {

    const typeName = benderTypeDef.name

    // these are some hacks
    // TODO: annotate proper types for typescript
    if (benderTypeDef.size) {
      if (benderTypeDef.size == 8) {
        // needs big int
        return `export type ${typeName} = number[]`
      }
      else {
        return `export type ${typeName} = number`
      }
    }

    if (benderTypeDef.alias) {
      return `export type ${typeName} = ${benderTypeDef.alias}`
    }

    const members = benderTypeDef.fields
      ? getMembers(benderTypeDef.fields)
      : []

    const membersString = members.join('\n')

    return `export interface ${typeName} {
${membersString}
}`
  })

  const result = declarations.join('\n\n')
  const moduleWrapped = `namespace messages {
    ${result}
  }

  export = messages
  `

  fs.writeFileSync(fileName, moduleWrapped)
  console.log(`WRITTEN: ${fileName}`)
}
