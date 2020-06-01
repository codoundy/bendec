export enum Kind {
  Primitive = 1,
  Alias = 2,
  Struct = 3,
  Enum = 4,
  Union = 5,
}

export interface Primitive {
  kind?: Kind.Primitive
  name: string
  desc?: string
  size: number
}

export interface Alias {
  kind?: Kind.Alias
  name: string
  desc?: string
  alias: string
}

export interface Field {
  name: string
  desc?: string
  type: string
  // if length is specified it's an array
  length?: number
}

export interface Struct {
  kind?: Kind.Struct
  name: string
  desc?: string
  fields: Field[]
}

// enum type is also only to generate types and is not validated by BendecJS
// It will alias to 'underlying' unsigned primitive
export type EnumVariant = [string, number]
export interface Enum {
  kind?: Kind.Enum
  name: string
  desc?: string
  underlying: string
  offset?: number
  variants: EnumVariant[]
}

// Bendec doesn't support Union type as a field type yet
// this is just so we can generate types / code for TS, Rust, C++
//
// Proposal: say we have { foobar: Foo | Bar }
// to read foobar as Foo we would access it as foobar.foo, same for foobar.bar
// Union in Rust has to have fields named (unlike C++)
export interface Union {
  kind?: Kind.Union
  name: string
  desc?: string
  discriminator: string[]
  members: string[]
}

export type TypeDefinition = Primitive | Alias | Struct | Enum | Union

type KindRequired<T extends { kind?: Kind }> = Pick<T, Exclude<keyof T, 'kind'>> & {
  kind: T['kind']
}

export type PrimitiveStrict = KindRequired<Primitive>
export type AliasStrict = KindRequired<Alias>
export type StructStrict = KindRequired<Struct>
export type EnumStrict = KindRequired<Enum>
export type UnionStrict = KindRequired<Union>

/* This type is for internal use after conversion from TypeDefinition */
export type TypeDefinitionStrict = PrimitiveStrict | AliasStrict | StructStrict | EnumStrict | UnionStrict

export type Reader = (index: number, length: number) => [string, number]
export type Writer = (index: number, length: number, path?: string) => [string, number]

export interface VariantGetter {
  encode(msg: any): string
  decode(buf: Buffer): string
}

export interface Config {
  types?: TypeDefinition[]
  namespace?: string
  readers?: { [t: string]: Reader }
  writers?: { [t: string]: Writer }
  getVariant?: VariantGetter
}

export interface TypedBuffer<T> extends Buffer {
  __phantom?: T
}

export interface IBufferWrapper<T> {
  setBuffer(buffer: TypedBuffer<T>): BufferWrapper<T>
  getBuffer(): TypedBuffer<T>
}

export type BufferWrapper<T> = T & IBufferWrapper<T>

export const Errors = {
  TYPE_NOT_FOUND: 'TYPE_NOT_FOUND',
  UNKNOWN_SIZE: 'UNKNOWN_SIZE'
}

export interface Lookup {
  [typeName: string]: TypeDefinitionStrict
}
