
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model profiles
 * 
 */
export type profiles = $Result.DefaultSelection<Prisma.$profilesPayload>
/**
 * Model repositories
 * 
 */
export type repositories = $Result.DefaultSelection<Prisma.$repositoriesPayload>
/**
 * Model saved_repositories
 * 
 */
export type saved_repositories = $Result.DefaultSelection<Prisma.$saved_repositoriesPayload>
/**
 * Model analyses
 * 
 */
export type analyses = $Result.DefaultSelection<Prisma.$analysesPayload>
/**
 * Model user_roles
 * 
 */
export type user_roles = $Result.DefaultSelection<Prisma.$user_rolesPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const app_role: {
  admin: 'admin',
  moderator: 'moderator',
  user: 'user'
};

export type app_role = (typeof app_role)[keyof typeof app_role]

}

export type app_role = $Enums.app_role

export const app_role: typeof $Enums.app_role

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Profiles
 * const profiles = await prisma.profiles.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Profiles
   * const profiles = await prisma.profiles.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.profiles`: Exposes CRUD operations for the **profiles** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Profiles
    * const profiles = await prisma.profiles.findMany()
    * ```
    */
  get profiles(): Prisma.profilesDelegate<ExtArgs>;

  /**
   * `prisma.repositories`: Exposes CRUD operations for the **repositories** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Repositories
    * const repositories = await prisma.repositories.findMany()
    * ```
    */
  get repositories(): Prisma.repositoriesDelegate<ExtArgs>;

  /**
   * `prisma.saved_repositories`: Exposes CRUD operations for the **saved_repositories** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Saved_repositories
    * const saved_repositories = await prisma.saved_repositories.findMany()
    * ```
    */
  get saved_repositories(): Prisma.saved_repositoriesDelegate<ExtArgs>;

  /**
   * `prisma.analyses`: Exposes CRUD operations for the **analyses** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Analyses
    * const analyses = await prisma.analyses.findMany()
    * ```
    */
  get analyses(): Prisma.analysesDelegate<ExtArgs>;

  /**
   * `prisma.user_roles`: Exposes CRUD operations for the **user_roles** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more User_roles
    * const user_roles = await prisma.user_roles.findMany()
    * ```
    */
  get user_roles(): Prisma.user_rolesDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    profiles: 'profiles',
    repositories: 'repositories',
    saved_repositories: 'saved_repositories',
    analyses: 'analyses',
    user_roles: 'user_roles'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "profiles" | "repositories" | "saved_repositories" | "analyses" | "user_roles"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      profiles: {
        payload: Prisma.$profilesPayload<ExtArgs>
        fields: Prisma.profilesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.profilesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.profilesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>
          }
          findFirst: {
            args: Prisma.profilesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.profilesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>
          }
          findMany: {
            args: Prisma.profilesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>[]
          }
          create: {
            args: Prisma.profilesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>
          }
          createMany: {
            args: Prisma.profilesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.profilesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>[]
          }
          delete: {
            args: Prisma.profilesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>
          }
          update: {
            args: Prisma.profilesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>
          }
          deleteMany: {
            args: Prisma.profilesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.profilesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.profilesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>
          }
          aggregate: {
            args: Prisma.ProfilesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfiles>
          }
          groupBy: {
            args: Prisma.profilesGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfilesGroupByOutputType>[]
          }
          count: {
            args: Prisma.profilesCountArgs<ExtArgs>
            result: $Utils.Optional<ProfilesCountAggregateOutputType> | number
          }
        }
      }
      repositories: {
        payload: Prisma.$repositoriesPayload<ExtArgs>
        fields: Prisma.repositoriesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.repositoriesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$repositoriesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.repositoriesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$repositoriesPayload>
          }
          findFirst: {
            args: Prisma.repositoriesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$repositoriesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.repositoriesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$repositoriesPayload>
          }
          findMany: {
            args: Prisma.repositoriesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$repositoriesPayload>[]
          }
          create: {
            args: Prisma.repositoriesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$repositoriesPayload>
          }
          createMany: {
            args: Prisma.repositoriesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.repositoriesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$repositoriesPayload>[]
          }
          delete: {
            args: Prisma.repositoriesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$repositoriesPayload>
          }
          update: {
            args: Prisma.repositoriesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$repositoriesPayload>
          }
          deleteMany: {
            args: Prisma.repositoriesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.repositoriesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.repositoriesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$repositoriesPayload>
          }
          aggregate: {
            args: Prisma.RepositoriesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRepositories>
          }
          groupBy: {
            args: Prisma.repositoriesGroupByArgs<ExtArgs>
            result: $Utils.Optional<RepositoriesGroupByOutputType>[]
          }
          count: {
            args: Prisma.repositoriesCountArgs<ExtArgs>
            result: $Utils.Optional<RepositoriesCountAggregateOutputType> | number
          }
        }
      }
      saved_repositories: {
        payload: Prisma.$saved_repositoriesPayload<ExtArgs>
        fields: Prisma.saved_repositoriesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.saved_repositoriesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$saved_repositoriesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.saved_repositoriesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$saved_repositoriesPayload>
          }
          findFirst: {
            args: Prisma.saved_repositoriesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$saved_repositoriesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.saved_repositoriesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$saved_repositoriesPayload>
          }
          findMany: {
            args: Prisma.saved_repositoriesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$saved_repositoriesPayload>[]
          }
          create: {
            args: Prisma.saved_repositoriesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$saved_repositoriesPayload>
          }
          createMany: {
            args: Prisma.saved_repositoriesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.saved_repositoriesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$saved_repositoriesPayload>[]
          }
          delete: {
            args: Prisma.saved_repositoriesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$saved_repositoriesPayload>
          }
          update: {
            args: Prisma.saved_repositoriesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$saved_repositoriesPayload>
          }
          deleteMany: {
            args: Prisma.saved_repositoriesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.saved_repositoriesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.saved_repositoriesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$saved_repositoriesPayload>
          }
          aggregate: {
            args: Prisma.Saved_repositoriesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSaved_repositories>
          }
          groupBy: {
            args: Prisma.saved_repositoriesGroupByArgs<ExtArgs>
            result: $Utils.Optional<Saved_repositoriesGroupByOutputType>[]
          }
          count: {
            args: Prisma.saved_repositoriesCountArgs<ExtArgs>
            result: $Utils.Optional<Saved_repositoriesCountAggregateOutputType> | number
          }
        }
      }
      analyses: {
        payload: Prisma.$analysesPayload<ExtArgs>
        fields: Prisma.analysesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.analysesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$analysesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.analysesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$analysesPayload>
          }
          findFirst: {
            args: Prisma.analysesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$analysesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.analysesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$analysesPayload>
          }
          findMany: {
            args: Prisma.analysesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$analysesPayload>[]
          }
          create: {
            args: Prisma.analysesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$analysesPayload>
          }
          createMany: {
            args: Prisma.analysesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.analysesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$analysesPayload>[]
          }
          delete: {
            args: Prisma.analysesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$analysesPayload>
          }
          update: {
            args: Prisma.analysesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$analysesPayload>
          }
          deleteMany: {
            args: Prisma.analysesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.analysesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.analysesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$analysesPayload>
          }
          aggregate: {
            args: Prisma.AnalysesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnalyses>
          }
          groupBy: {
            args: Prisma.analysesGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnalysesGroupByOutputType>[]
          }
          count: {
            args: Prisma.analysesCountArgs<ExtArgs>
            result: $Utils.Optional<AnalysesCountAggregateOutputType> | number
          }
        }
      }
      user_roles: {
        payload: Prisma.$user_rolesPayload<ExtArgs>
        fields: Prisma.user_rolesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.user_rolesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_rolesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.user_rolesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_rolesPayload>
          }
          findFirst: {
            args: Prisma.user_rolesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_rolesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.user_rolesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_rolesPayload>
          }
          findMany: {
            args: Prisma.user_rolesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_rolesPayload>[]
          }
          create: {
            args: Prisma.user_rolesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_rolesPayload>
          }
          createMany: {
            args: Prisma.user_rolesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.user_rolesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_rolesPayload>[]
          }
          delete: {
            args: Prisma.user_rolesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_rolesPayload>
          }
          update: {
            args: Prisma.user_rolesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_rolesPayload>
          }
          deleteMany: {
            args: Prisma.user_rolesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.user_rolesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.user_rolesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_rolesPayload>
          }
          aggregate: {
            args: Prisma.User_rolesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser_roles>
          }
          groupBy: {
            args: Prisma.user_rolesGroupByArgs<ExtArgs>
            result: $Utils.Optional<User_rolesGroupByOutputType>[]
          }
          count: {
            args: Prisma.user_rolesCountArgs<ExtArgs>
            result: $Utils.Optional<User_rolesCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ProfilesCountOutputType
   */

  export type ProfilesCountOutputType = {
    saved_repositories: number
    analyses: number
  }

  export type ProfilesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    saved_repositories?: boolean | ProfilesCountOutputTypeCountSaved_repositoriesArgs
    analyses?: boolean | ProfilesCountOutputTypeCountAnalysesArgs
  }

  // Custom InputTypes
  /**
   * ProfilesCountOutputType without action
   */
  export type ProfilesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfilesCountOutputType
     */
    select?: ProfilesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProfilesCountOutputType without action
   */
  export type ProfilesCountOutputTypeCountSaved_repositoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: saved_repositoriesWhereInput
  }

  /**
   * ProfilesCountOutputType without action
   */
  export type ProfilesCountOutputTypeCountAnalysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: analysesWhereInput
  }


  /**
   * Count Type RepositoriesCountOutputType
   */

  export type RepositoriesCountOutputType = {
    saved_by: number
    analyses: number
  }

  export type RepositoriesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    saved_by?: boolean | RepositoriesCountOutputTypeCountSaved_byArgs
    analyses?: boolean | RepositoriesCountOutputTypeCountAnalysesArgs
  }

  // Custom InputTypes
  /**
   * RepositoriesCountOutputType without action
   */
  export type RepositoriesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RepositoriesCountOutputType
     */
    select?: RepositoriesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RepositoriesCountOutputType without action
   */
  export type RepositoriesCountOutputTypeCountSaved_byArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: saved_repositoriesWhereInput
  }

  /**
   * RepositoriesCountOutputType without action
   */
  export type RepositoriesCountOutputTypeCountAnalysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: analysesWhereInput
  }


  /**
   * Models
   */

  /**
   * Model profiles
   */

  export type AggregateProfiles = {
    _count: ProfilesCountAggregateOutputType | null
    _min: ProfilesMinAggregateOutputType | null
    _max: ProfilesMaxAggregateOutputType | null
  }

  export type ProfilesMinAggregateOutputType = {
    id: string | null
    email: string | null
    full_name: string | null
    avatar_url: string | null
    bio: string | null
    github_username: string | null
    experience_level: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ProfilesMaxAggregateOutputType = {
    id: string | null
    email: string | null
    full_name: string | null
    avatar_url: string | null
    bio: string | null
    github_username: string | null
    experience_level: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ProfilesCountAggregateOutputType = {
    id: number
    email: number
    full_name: number
    avatar_url: number
    bio: number
    github_username: number
    experience_level: number
    tech_interests: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ProfilesMinAggregateInputType = {
    id?: true
    email?: true
    full_name?: true
    avatar_url?: true
    bio?: true
    github_username?: true
    experience_level?: true
    created_at?: true
    updated_at?: true
  }

  export type ProfilesMaxAggregateInputType = {
    id?: true
    email?: true
    full_name?: true
    avatar_url?: true
    bio?: true
    github_username?: true
    experience_level?: true
    created_at?: true
    updated_at?: true
  }

  export type ProfilesCountAggregateInputType = {
    id?: true
    email?: true
    full_name?: true
    avatar_url?: true
    bio?: true
    github_username?: true
    experience_level?: true
    tech_interests?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ProfilesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which profiles to aggregate.
     */
    where?: profilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of profiles to fetch.
     */
    orderBy?: profilesOrderByWithRelationInput | profilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: profilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned profiles
    **/
    _count?: true | ProfilesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfilesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfilesMaxAggregateInputType
  }

  export type GetProfilesAggregateType<T extends ProfilesAggregateArgs> = {
        [P in keyof T & keyof AggregateProfiles]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfiles[P]>
      : GetScalarType<T[P], AggregateProfiles[P]>
  }




  export type profilesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: profilesWhereInput
    orderBy?: profilesOrderByWithAggregationInput | profilesOrderByWithAggregationInput[]
    by: ProfilesScalarFieldEnum[] | ProfilesScalarFieldEnum
    having?: profilesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfilesCountAggregateInputType | true
    _min?: ProfilesMinAggregateInputType
    _max?: ProfilesMaxAggregateInputType
  }

  export type ProfilesGroupByOutputType = {
    id: string
    email: string | null
    full_name: string | null
    avatar_url: string | null
    bio: string | null
    github_username: string | null
    experience_level: string | null
    tech_interests: string[]
    created_at: Date | null
    updated_at: Date | null
    _count: ProfilesCountAggregateOutputType | null
    _min: ProfilesMinAggregateOutputType | null
    _max: ProfilesMaxAggregateOutputType | null
  }

  type GetProfilesGroupByPayload<T extends profilesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfilesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfilesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfilesGroupByOutputType[P]>
            : GetScalarType<T[P], ProfilesGroupByOutputType[P]>
        }
      >
    >


  export type profilesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    full_name?: boolean
    avatar_url?: boolean
    bio?: boolean
    github_username?: boolean
    experience_level?: boolean
    tech_interests?: boolean
    created_at?: boolean
    updated_at?: boolean
    saved_repositories?: boolean | profiles$saved_repositoriesArgs<ExtArgs>
    analyses?: boolean | profiles$analysesArgs<ExtArgs>
    _count?: boolean | ProfilesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profiles"]>

  export type profilesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    full_name?: boolean
    avatar_url?: boolean
    bio?: boolean
    github_username?: boolean
    experience_level?: boolean
    tech_interests?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["profiles"]>

  export type profilesSelectScalar = {
    id?: boolean
    email?: boolean
    full_name?: boolean
    avatar_url?: boolean
    bio?: boolean
    github_username?: boolean
    experience_level?: boolean
    tech_interests?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type profilesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    saved_repositories?: boolean | profiles$saved_repositoriesArgs<ExtArgs>
    analyses?: boolean | profiles$analysesArgs<ExtArgs>
    _count?: boolean | ProfilesCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type profilesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $profilesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "profiles"
    objects: {
      saved_repositories: Prisma.$saved_repositoriesPayload<ExtArgs>[]
      analyses: Prisma.$analysesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string | null
      full_name: string | null
      avatar_url: string | null
      bio: string | null
      github_username: string | null
      experience_level: string | null
      tech_interests: string[]
      created_at: Date | null
      updated_at: Date | null
    }, ExtArgs["result"]["profiles"]>
    composites: {}
  }

  type profilesGetPayload<S extends boolean | null | undefined | profilesDefaultArgs> = $Result.GetResult<Prisma.$profilesPayload, S>

  type profilesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<profilesFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProfilesCountAggregateInputType | true
    }

  export interface profilesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['profiles'], meta: { name: 'profiles' } }
    /**
     * Find zero or one Profiles that matches the filter.
     * @param {profilesFindUniqueArgs} args - Arguments to find a Profiles
     * @example
     * // Get one Profiles
     * const profiles = await prisma.profiles.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends profilesFindUniqueArgs>(args: SelectSubset<T, profilesFindUniqueArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Profiles that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {profilesFindUniqueOrThrowArgs} args - Arguments to find a Profiles
     * @example
     * // Get one Profiles
     * const profiles = await prisma.profiles.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends profilesFindUniqueOrThrowArgs>(args: SelectSubset<T, profilesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {profilesFindFirstArgs} args - Arguments to find a Profiles
     * @example
     * // Get one Profiles
     * const profiles = await prisma.profiles.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends profilesFindFirstArgs>(args?: SelectSubset<T, profilesFindFirstArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Profiles that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {profilesFindFirstOrThrowArgs} args - Arguments to find a Profiles
     * @example
     * // Get one Profiles
     * const profiles = await prisma.profiles.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends profilesFindFirstOrThrowArgs>(args?: SelectSubset<T, profilesFindFirstOrThrowArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {profilesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Profiles
     * const profiles = await prisma.profiles.findMany()
     * 
     * // Get first 10 Profiles
     * const profiles = await prisma.profiles.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const profilesWithIdOnly = await prisma.profiles.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends profilesFindManyArgs>(args?: SelectSubset<T, profilesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Profiles.
     * @param {profilesCreateArgs} args - Arguments to create a Profiles.
     * @example
     * // Create one Profiles
     * const Profiles = await prisma.profiles.create({
     *   data: {
     *     // ... data to create a Profiles
     *   }
     * })
     * 
     */
    create<T extends profilesCreateArgs>(args: SelectSubset<T, profilesCreateArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Profiles.
     * @param {profilesCreateManyArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profiles = await prisma.profiles.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends profilesCreateManyArgs>(args?: SelectSubset<T, profilesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Profiles and returns the data saved in the database.
     * @param {profilesCreateManyAndReturnArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profiles = await prisma.profiles.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Profiles and only return the `id`
     * const profilesWithIdOnly = await prisma.profiles.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends profilesCreateManyAndReturnArgs>(args?: SelectSubset<T, profilesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Profiles.
     * @param {profilesDeleteArgs} args - Arguments to delete one Profiles.
     * @example
     * // Delete one Profiles
     * const Profiles = await prisma.profiles.delete({
     *   where: {
     *     // ... filter to delete one Profiles
     *   }
     * })
     * 
     */
    delete<T extends profilesDeleteArgs>(args: SelectSubset<T, profilesDeleteArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Profiles.
     * @param {profilesUpdateArgs} args - Arguments to update one Profiles.
     * @example
     * // Update one Profiles
     * const profiles = await prisma.profiles.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends profilesUpdateArgs>(args: SelectSubset<T, profilesUpdateArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Profiles.
     * @param {profilesDeleteManyArgs} args - Arguments to filter Profiles to delete.
     * @example
     * // Delete a few Profiles
     * const { count } = await prisma.profiles.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends profilesDeleteManyArgs>(args?: SelectSubset<T, profilesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {profilesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Profiles
     * const profiles = await prisma.profiles.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends profilesUpdateManyArgs>(args: SelectSubset<T, profilesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Profiles.
     * @param {profilesUpsertArgs} args - Arguments to update or create a Profiles.
     * @example
     * // Update or create a Profiles
     * const profiles = await prisma.profiles.upsert({
     *   create: {
     *     // ... data to create a Profiles
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Profiles we want to update
     *   }
     * })
     */
    upsert<T extends profilesUpsertArgs>(args: SelectSubset<T, profilesUpsertArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {profilesCountArgs} args - Arguments to filter Profiles to count.
     * @example
     * // Count the number of Profiles
     * const count = await prisma.profiles.count({
     *   where: {
     *     // ... the filter for the Profiles we want to count
     *   }
     * })
    **/
    count<T extends profilesCountArgs>(
      args?: Subset<T, profilesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfilesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfilesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProfilesAggregateArgs>(args: Subset<T, ProfilesAggregateArgs>): Prisma.PrismaPromise<GetProfilesAggregateType<T>>

    /**
     * Group by Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {profilesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends profilesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: profilesGroupByArgs['orderBy'] }
        : { orderBy?: profilesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, profilesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfilesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the profiles model
   */
  readonly fields: profilesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for profiles.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__profilesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    saved_repositories<T extends profiles$saved_repositoriesArgs<ExtArgs> = {}>(args?: Subset<T, profiles$saved_repositoriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$saved_repositoriesPayload<ExtArgs>, T, "findMany"> | Null>
    analyses<T extends profiles$analysesArgs<ExtArgs> = {}>(args?: Subset<T, profiles$analysesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$analysesPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the profiles model
   */ 
  interface profilesFieldRefs {
    readonly id: FieldRef<"profiles", 'String'>
    readonly email: FieldRef<"profiles", 'String'>
    readonly full_name: FieldRef<"profiles", 'String'>
    readonly avatar_url: FieldRef<"profiles", 'String'>
    readonly bio: FieldRef<"profiles", 'String'>
    readonly github_username: FieldRef<"profiles", 'String'>
    readonly experience_level: FieldRef<"profiles", 'String'>
    readonly tech_interests: FieldRef<"profiles", 'String[]'>
    readonly created_at: FieldRef<"profiles", 'DateTime'>
    readonly updated_at: FieldRef<"profiles", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * profiles findUnique
   */
  export type profilesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: profilesInclude<ExtArgs> | null
    /**
     * Filter, which profiles to fetch.
     */
    where: profilesWhereUniqueInput
  }

  /**
   * profiles findUniqueOrThrow
   */
  export type profilesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: profilesInclude<ExtArgs> | null
    /**
     * Filter, which profiles to fetch.
     */
    where: profilesWhereUniqueInput
  }

  /**
   * profiles findFirst
   */
  export type profilesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: profilesInclude<ExtArgs> | null
    /**
     * Filter, which profiles to fetch.
     */
    where?: profilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of profiles to fetch.
     */
    orderBy?: profilesOrderByWithRelationInput | profilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for profiles.
     */
    cursor?: profilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of profiles.
     */
    distinct?: ProfilesScalarFieldEnum | ProfilesScalarFieldEnum[]
  }

  /**
   * profiles findFirstOrThrow
   */
  export type profilesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: profilesInclude<ExtArgs> | null
    /**
     * Filter, which profiles to fetch.
     */
    where?: profilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of profiles to fetch.
     */
    orderBy?: profilesOrderByWithRelationInput | profilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for profiles.
     */
    cursor?: profilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of profiles.
     */
    distinct?: ProfilesScalarFieldEnum | ProfilesScalarFieldEnum[]
  }

  /**
   * profiles findMany
   */
  export type profilesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: profilesInclude<ExtArgs> | null
    /**
     * Filter, which profiles to fetch.
     */
    where?: profilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of profiles to fetch.
     */
    orderBy?: profilesOrderByWithRelationInput | profilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing profiles.
     */
    cursor?: profilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` profiles.
     */
    skip?: number
    distinct?: ProfilesScalarFieldEnum | ProfilesScalarFieldEnum[]
  }

  /**
   * profiles create
   */
  export type profilesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: profilesInclude<ExtArgs> | null
    /**
     * The data needed to create a profiles.
     */
    data?: XOR<profilesCreateInput, profilesUncheckedCreateInput>
  }

  /**
   * profiles createMany
   */
  export type profilesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many profiles.
     */
    data: profilesCreateManyInput | profilesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * profiles createManyAndReturn
   */
  export type profilesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many profiles.
     */
    data: profilesCreateManyInput | profilesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * profiles update
   */
  export type profilesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: profilesInclude<ExtArgs> | null
    /**
     * The data needed to update a profiles.
     */
    data: XOR<profilesUpdateInput, profilesUncheckedUpdateInput>
    /**
     * Choose, which profiles to update.
     */
    where: profilesWhereUniqueInput
  }

  /**
   * profiles updateMany
   */
  export type profilesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update profiles.
     */
    data: XOR<profilesUpdateManyMutationInput, profilesUncheckedUpdateManyInput>
    /**
     * Filter which profiles to update
     */
    where?: profilesWhereInput
  }

  /**
   * profiles upsert
   */
  export type profilesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: profilesInclude<ExtArgs> | null
    /**
     * The filter to search for the profiles to update in case it exists.
     */
    where: profilesWhereUniqueInput
    /**
     * In case the profiles found by the `where` argument doesn't exist, create a new profiles with this data.
     */
    create: XOR<profilesCreateInput, profilesUncheckedCreateInput>
    /**
     * In case the profiles was found with the provided `where` argument, update it with this data.
     */
    update: XOR<profilesUpdateInput, profilesUncheckedUpdateInput>
  }

  /**
   * profiles delete
   */
  export type profilesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: profilesInclude<ExtArgs> | null
    /**
     * Filter which profiles to delete.
     */
    where: profilesWhereUniqueInput
  }

  /**
   * profiles deleteMany
   */
  export type profilesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which profiles to delete
     */
    where?: profilesWhereInput
  }

  /**
   * profiles.saved_repositories
   */
  export type profiles$saved_repositoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saved_repositories
     */
    select?: saved_repositoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saved_repositoriesInclude<ExtArgs> | null
    where?: saved_repositoriesWhereInput
    orderBy?: saved_repositoriesOrderByWithRelationInput | saved_repositoriesOrderByWithRelationInput[]
    cursor?: saved_repositoriesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Saved_repositoriesScalarFieldEnum | Saved_repositoriesScalarFieldEnum[]
  }

  /**
   * profiles.analyses
   */
  export type profiles$analysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the analyses
     */
    select?: analysesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: analysesInclude<ExtArgs> | null
    where?: analysesWhereInput
    orderBy?: analysesOrderByWithRelationInput | analysesOrderByWithRelationInput[]
    cursor?: analysesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnalysesScalarFieldEnum | AnalysesScalarFieldEnum[]
  }

  /**
   * profiles without action
   */
  export type profilesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: profilesInclude<ExtArgs> | null
  }


  /**
   * Model repositories
   */

  export type AggregateRepositories = {
    _count: RepositoriesCountAggregateOutputType | null
    _avg: RepositoriesAvgAggregateOutputType | null
    _sum: RepositoriesSumAggregateOutputType | null
    _min: RepositoriesMinAggregateOutputType | null
    _max: RepositoriesMaxAggregateOutputType | null
  }

  export type RepositoriesAvgAggregateOutputType = {
    id: number | null
  }

  export type RepositoriesSumAggregateOutputType = {
    id: bigint | null
  }

  export type RepositoriesMinAggregateOutputType = {
    id: bigint | null
    full_name: string | null
    last_analyzed: Date | null
    created_at: Date | null
  }

  export type RepositoriesMaxAggregateOutputType = {
    id: bigint | null
    full_name: string | null
    last_analyzed: Date | null
    created_at: Date | null
  }

  export type RepositoriesCountAggregateOutputType = {
    id: number
    full_name: number
    data: number
    last_analyzed: number
    created_at: number
    _all: number
  }


  export type RepositoriesAvgAggregateInputType = {
    id?: true
  }

  export type RepositoriesSumAggregateInputType = {
    id?: true
  }

  export type RepositoriesMinAggregateInputType = {
    id?: true
    full_name?: true
    last_analyzed?: true
    created_at?: true
  }

  export type RepositoriesMaxAggregateInputType = {
    id?: true
    full_name?: true
    last_analyzed?: true
    created_at?: true
  }

  export type RepositoriesCountAggregateInputType = {
    id?: true
    full_name?: true
    data?: true
    last_analyzed?: true
    created_at?: true
    _all?: true
  }

  export type RepositoriesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which repositories to aggregate.
     */
    where?: repositoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of repositories to fetch.
     */
    orderBy?: repositoriesOrderByWithRelationInput | repositoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: repositoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` repositories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` repositories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned repositories
    **/
    _count?: true | RepositoriesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RepositoriesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RepositoriesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RepositoriesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RepositoriesMaxAggregateInputType
  }

  export type GetRepositoriesAggregateType<T extends RepositoriesAggregateArgs> = {
        [P in keyof T & keyof AggregateRepositories]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRepositories[P]>
      : GetScalarType<T[P], AggregateRepositories[P]>
  }




  export type repositoriesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: repositoriesWhereInput
    orderBy?: repositoriesOrderByWithAggregationInput | repositoriesOrderByWithAggregationInput[]
    by: RepositoriesScalarFieldEnum[] | RepositoriesScalarFieldEnum
    having?: repositoriesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RepositoriesCountAggregateInputType | true
    _avg?: RepositoriesAvgAggregateInputType
    _sum?: RepositoriesSumAggregateInputType
    _min?: RepositoriesMinAggregateInputType
    _max?: RepositoriesMaxAggregateInputType
  }

  export type RepositoriesGroupByOutputType = {
    id: bigint
    full_name: string
    data: JsonValue
    last_analyzed: Date | null
    created_at: Date | null
    _count: RepositoriesCountAggregateOutputType | null
    _avg: RepositoriesAvgAggregateOutputType | null
    _sum: RepositoriesSumAggregateOutputType | null
    _min: RepositoriesMinAggregateOutputType | null
    _max: RepositoriesMaxAggregateOutputType | null
  }

  type GetRepositoriesGroupByPayload<T extends repositoriesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RepositoriesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RepositoriesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RepositoriesGroupByOutputType[P]>
            : GetScalarType<T[P], RepositoriesGroupByOutputType[P]>
        }
      >
    >


  export type repositoriesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    full_name?: boolean
    data?: boolean
    last_analyzed?: boolean
    created_at?: boolean
    saved_by?: boolean | repositories$saved_byArgs<ExtArgs>
    analyses?: boolean | repositories$analysesArgs<ExtArgs>
    _count?: boolean | RepositoriesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["repositories"]>

  export type repositoriesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    full_name?: boolean
    data?: boolean
    last_analyzed?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["repositories"]>

  export type repositoriesSelectScalar = {
    id?: boolean
    full_name?: boolean
    data?: boolean
    last_analyzed?: boolean
    created_at?: boolean
  }

  export type repositoriesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    saved_by?: boolean | repositories$saved_byArgs<ExtArgs>
    analyses?: boolean | repositories$analysesArgs<ExtArgs>
    _count?: boolean | RepositoriesCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type repositoriesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $repositoriesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "repositories"
    objects: {
      saved_by: Prisma.$saved_repositoriesPayload<ExtArgs>[]
      analyses: Prisma.$analysesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      full_name: string
      data: Prisma.JsonValue
      last_analyzed: Date | null
      created_at: Date | null
    }, ExtArgs["result"]["repositories"]>
    composites: {}
  }

  type repositoriesGetPayload<S extends boolean | null | undefined | repositoriesDefaultArgs> = $Result.GetResult<Prisma.$repositoriesPayload, S>

  type repositoriesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<repositoriesFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RepositoriesCountAggregateInputType | true
    }

  export interface repositoriesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['repositories'], meta: { name: 'repositories' } }
    /**
     * Find zero or one Repositories that matches the filter.
     * @param {repositoriesFindUniqueArgs} args - Arguments to find a Repositories
     * @example
     * // Get one Repositories
     * const repositories = await prisma.repositories.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends repositoriesFindUniqueArgs>(args: SelectSubset<T, repositoriesFindUniqueArgs<ExtArgs>>): Prisma__repositoriesClient<$Result.GetResult<Prisma.$repositoriesPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Repositories that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {repositoriesFindUniqueOrThrowArgs} args - Arguments to find a Repositories
     * @example
     * // Get one Repositories
     * const repositories = await prisma.repositories.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends repositoriesFindUniqueOrThrowArgs>(args: SelectSubset<T, repositoriesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__repositoriesClient<$Result.GetResult<Prisma.$repositoriesPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Repositories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {repositoriesFindFirstArgs} args - Arguments to find a Repositories
     * @example
     * // Get one Repositories
     * const repositories = await prisma.repositories.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends repositoriesFindFirstArgs>(args?: SelectSubset<T, repositoriesFindFirstArgs<ExtArgs>>): Prisma__repositoriesClient<$Result.GetResult<Prisma.$repositoriesPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Repositories that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {repositoriesFindFirstOrThrowArgs} args - Arguments to find a Repositories
     * @example
     * // Get one Repositories
     * const repositories = await prisma.repositories.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends repositoriesFindFirstOrThrowArgs>(args?: SelectSubset<T, repositoriesFindFirstOrThrowArgs<ExtArgs>>): Prisma__repositoriesClient<$Result.GetResult<Prisma.$repositoriesPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Repositories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {repositoriesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Repositories
     * const repositories = await prisma.repositories.findMany()
     * 
     * // Get first 10 Repositories
     * const repositories = await prisma.repositories.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const repositoriesWithIdOnly = await prisma.repositories.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends repositoriesFindManyArgs>(args?: SelectSubset<T, repositoriesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$repositoriesPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Repositories.
     * @param {repositoriesCreateArgs} args - Arguments to create a Repositories.
     * @example
     * // Create one Repositories
     * const Repositories = await prisma.repositories.create({
     *   data: {
     *     // ... data to create a Repositories
     *   }
     * })
     * 
     */
    create<T extends repositoriesCreateArgs>(args: SelectSubset<T, repositoriesCreateArgs<ExtArgs>>): Prisma__repositoriesClient<$Result.GetResult<Prisma.$repositoriesPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Repositories.
     * @param {repositoriesCreateManyArgs} args - Arguments to create many Repositories.
     * @example
     * // Create many Repositories
     * const repositories = await prisma.repositories.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends repositoriesCreateManyArgs>(args?: SelectSubset<T, repositoriesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Repositories and returns the data saved in the database.
     * @param {repositoriesCreateManyAndReturnArgs} args - Arguments to create many Repositories.
     * @example
     * // Create many Repositories
     * const repositories = await prisma.repositories.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Repositories and only return the `id`
     * const repositoriesWithIdOnly = await prisma.repositories.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends repositoriesCreateManyAndReturnArgs>(args?: SelectSubset<T, repositoriesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$repositoriesPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Repositories.
     * @param {repositoriesDeleteArgs} args - Arguments to delete one Repositories.
     * @example
     * // Delete one Repositories
     * const Repositories = await prisma.repositories.delete({
     *   where: {
     *     // ... filter to delete one Repositories
     *   }
     * })
     * 
     */
    delete<T extends repositoriesDeleteArgs>(args: SelectSubset<T, repositoriesDeleteArgs<ExtArgs>>): Prisma__repositoriesClient<$Result.GetResult<Prisma.$repositoriesPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Repositories.
     * @param {repositoriesUpdateArgs} args - Arguments to update one Repositories.
     * @example
     * // Update one Repositories
     * const repositories = await prisma.repositories.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends repositoriesUpdateArgs>(args: SelectSubset<T, repositoriesUpdateArgs<ExtArgs>>): Prisma__repositoriesClient<$Result.GetResult<Prisma.$repositoriesPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Repositories.
     * @param {repositoriesDeleteManyArgs} args - Arguments to filter Repositories to delete.
     * @example
     * // Delete a few Repositories
     * const { count } = await prisma.repositories.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends repositoriesDeleteManyArgs>(args?: SelectSubset<T, repositoriesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Repositories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {repositoriesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Repositories
     * const repositories = await prisma.repositories.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends repositoriesUpdateManyArgs>(args: SelectSubset<T, repositoriesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Repositories.
     * @param {repositoriesUpsertArgs} args - Arguments to update or create a Repositories.
     * @example
     * // Update or create a Repositories
     * const repositories = await prisma.repositories.upsert({
     *   create: {
     *     // ... data to create a Repositories
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Repositories we want to update
     *   }
     * })
     */
    upsert<T extends repositoriesUpsertArgs>(args: SelectSubset<T, repositoriesUpsertArgs<ExtArgs>>): Prisma__repositoriesClient<$Result.GetResult<Prisma.$repositoriesPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Repositories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {repositoriesCountArgs} args - Arguments to filter Repositories to count.
     * @example
     * // Count the number of Repositories
     * const count = await prisma.repositories.count({
     *   where: {
     *     // ... the filter for the Repositories we want to count
     *   }
     * })
    **/
    count<T extends repositoriesCountArgs>(
      args?: Subset<T, repositoriesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RepositoriesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Repositories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RepositoriesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RepositoriesAggregateArgs>(args: Subset<T, RepositoriesAggregateArgs>): Prisma.PrismaPromise<GetRepositoriesAggregateType<T>>

    /**
     * Group by Repositories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {repositoriesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends repositoriesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: repositoriesGroupByArgs['orderBy'] }
        : { orderBy?: repositoriesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, repositoriesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRepositoriesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the repositories model
   */
  readonly fields: repositoriesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for repositories.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__repositoriesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    saved_by<T extends repositories$saved_byArgs<ExtArgs> = {}>(args?: Subset<T, repositories$saved_byArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$saved_repositoriesPayload<ExtArgs>, T, "findMany"> | Null>
    analyses<T extends repositories$analysesArgs<ExtArgs> = {}>(args?: Subset<T, repositories$analysesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$analysesPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the repositories model
   */ 
  interface repositoriesFieldRefs {
    readonly id: FieldRef<"repositories", 'BigInt'>
    readonly full_name: FieldRef<"repositories", 'String'>
    readonly data: FieldRef<"repositories", 'Json'>
    readonly last_analyzed: FieldRef<"repositories", 'DateTime'>
    readonly created_at: FieldRef<"repositories", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * repositories findUnique
   */
  export type repositoriesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the repositories
     */
    select?: repositoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: repositoriesInclude<ExtArgs> | null
    /**
     * Filter, which repositories to fetch.
     */
    where: repositoriesWhereUniqueInput
  }

  /**
   * repositories findUniqueOrThrow
   */
  export type repositoriesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the repositories
     */
    select?: repositoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: repositoriesInclude<ExtArgs> | null
    /**
     * Filter, which repositories to fetch.
     */
    where: repositoriesWhereUniqueInput
  }

  /**
   * repositories findFirst
   */
  export type repositoriesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the repositories
     */
    select?: repositoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: repositoriesInclude<ExtArgs> | null
    /**
     * Filter, which repositories to fetch.
     */
    where?: repositoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of repositories to fetch.
     */
    orderBy?: repositoriesOrderByWithRelationInput | repositoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for repositories.
     */
    cursor?: repositoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` repositories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` repositories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of repositories.
     */
    distinct?: RepositoriesScalarFieldEnum | RepositoriesScalarFieldEnum[]
  }

  /**
   * repositories findFirstOrThrow
   */
  export type repositoriesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the repositories
     */
    select?: repositoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: repositoriesInclude<ExtArgs> | null
    /**
     * Filter, which repositories to fetch.
     */
    where?: repositoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of repositories to fetch.
     */
    orderBy?: repositoriesOrderByWithRelationInput | repositoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for repositories.
     */
    cursor?: repositoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` repositories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` repositories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of repositories.
     */
    distinct?: RepositoriesScalarFieldEnum | RepositoriesScalarFieldEnum[]
  }

  /**
   * repositories findMany
   */
  export type repositoriesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the repositories
     */
    select?: repositoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: repositoriesInclude<ExtArgs> | null
    /**
     * Filter, which repositories to fetch.
     */
    where?: repositoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of repositories to fetch.
     */
    orderBy?: repositoriesOrderByWithRelationInput | repositoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing repositories.
     */
    cursor?: repositoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` repositories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` repositories.
     */
    skip?: number
    distinct?: RepositoriesScalarFieldEnum | RepositoriesScalarFieldEnum[]
  }

  /**
   * repositories create
   */
  export type repositoriesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the repositories
     */
    select?: repositoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: repositoriesInclude<ExtArgs> | null
    /**
     * The data needed to create a repositories.
     */
    data: XOR<repositoriesCreateInput, repositoriesUncheckedCreateInput>
  }

  /**
   * repositories createMany
   */
  export type repositoriesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many repositories.
     */
    data: repositoriesCreateManyInput | repositoriesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * repositories createManyAndReturn
   */
  export type repositoriesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the repositories
     */
    select?: repositoriesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many repositories.
     */
    data: repositoriesCreateManyInput | repositoriesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * repositories update
   */
  export type repositoriesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the repositories
     */
    select?: repositoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: repositoriesInclude<ExtArgs> | null
    /**
     * The data needed to update a repositories.
     */
    data: XOR<repositoriesUpdateInput, repositoriesUncheckedUpdateInput>
    /**
     * Choose, which repositories to update.
     */
    where: repositoriesWhereUniqueInput
  }

  /**
   * repositories updateMany
   */
  export type repositoriesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update repositories.
     */
    data: XOR<repositoriesUpdateManyMutationInput, repositoriesUncheckedUpdateManyInput>
    /**
     * Filter which repositories to update
     */
    where?: repositoriesWhereInput
  }

  /**
   * repositories upsert
   */
  export type repositoriesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the repositories
     */
    select?: repositoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: repositoriesInclude<ExtArgs> | null
    /**
     * The filter to search for the repositories to update in case it exists.
     */
    where: repositoriesWhereUniqueInput
    /**
     * In case the repositories found by the `where` argument doesn't exist, create a new repositories with this data.
     */
    create: XOR<repositoriesCreateInput, repositoriesUncheckedCreateInput>
    /**
     * In case the repositories was found with the provided `where` argument, update it with this data.
     */
    update: XOR<repositoriesUpdateInput, repositoriesUncheckedUpdateInput>
  }

  /**
   * repositories delete
   */
  export type repositoriesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the repositories
     */
    select?: repositoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: repositoriesInclude<ExtArgs> | null
    /**
     * Filter which repositories to delete.
     */
    where: repositoriesWhereUniqueInput
  }

  /**
   * repositories deleteMany
   */
  export type repositoriesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which repositories to delete
     */
    where?: repositoriesWhereInput
  }

  /**
   * repositories.saved_by
   */
  export type repositories$saved_byArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saved_repositories
     */
    select?: saved_repositoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saved_repositoriesInclude<ExtArgs> | null
    where?: saved_repositoriesWhereInput
    orderBy?: saved_repositoriesOrderByWithRelationInput | saved_repositoriesOrderByWithRelationInput[]
    cursor?: saved_repositoriesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Saved_repositoriesScalarFieldEnum | Saved_repositoriesScalarFieldEnum[]
  }

  /**
   * repositories.analyses
   */
  export type repositories$analysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the analyses
     */
    select?: analysesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: analysesInclude<ExtArgs> | null
    where?: analysesWhereInput
    orderBy?: analysesOrderByWithRelationInput | analysesOrderByWithRelationInput[]
    cursor?: analysesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnalysesScalarFieldEnum | AnalysesScalarFieldEnum[]
  }

  /**
   * repositories without action
   */
  export type repositoriesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the repositories
     */
    select?: repositoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: repositoriesInclude<ExtArgs> | null
  }


  /**
   * Model saved_repositories
   */

  export type AggregateSaved_repositories = {
    _count: Saved_repositoriesCountAggregateOutputType | null
    _avg: Saved_repositoriesAvgAggregateOutputType | null
    _sum: Saved_repositoriesSumAggregateOutputType | null
    _min: Saved_repositoriesMinAggregateOutputType | null
    _max: Saved_repositoriesMaxAggregateOutputType | null
  }

  export type Saved_repositoriesAvgAggregateOutputType = {
    repository_id: number | null
  }

  export type Saved_repositoriesSumAggregateOutputType = {
    repository_id: bigint | null
  }

  export type Saved_repositoriesMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    repository_id: bigint | null
    created_at: Date | null
  }

  export type Saved_repositoriesMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    repository_id: bigint | null
    created_at: Date | null
  }

  export type Saved_repositoriesCountAggregateOutputType = {
    id: number
    user_id: number
    repository_id: number
    created_at: number
    _all: number
  }


  export type Saved_repositoriesAvgAggregateInputType = {
    repository_id?: true
  }

  export type Saved_repositoriesSumAggregateInputType = {
    repository_id?: true
  }

  export type Saved_repositoriesMinAggregateInputType = {
    id?: true
    user_id?: true
    repository_id?: true
    created_at?: true
  }

  export type Saved_repositoriesMaxAggregateInputType = {
    id?: true
    user_id?: true
    repository_id?: true
    created_at?: true
  }

  export type Saved_repositoriesCountAggregateInputType = {
    id?: true
    user_id?: true
    repository_id?: true
    created_at?: true
    _all?: true
  }

  export type Saved_repositoriesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which saved_repositories to aggregate.
     */
    where?: saved_repositoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of saved_repositories to fetch.
     */
    orderBy?: saved_repositoriesOrderByWithRelationInput | saved_repositoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: saved_repositoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` saved_repositories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` saved_repositories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned saved_repositories
    **/
    _count?: true | Saved_repositoriesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Saved_repositoriesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Saved_repositoriesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Saved_repositoriesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Saved_repositoriesMaxAggregateInputType
  }

  export type GetSaved_repositoriesAggregateType<T extends Saved_repositoriesAggregateArgs> = {
        [P in keyof T & keyof AggregateSaved_repositories]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSaved_repositories[P]>
      : GetScalarType<T[P], AggregateSaved_repositories[P]>
  }




  export type saved_repositoriesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: saved_repositoriesWhereInput
    orderBy?: saved_repositoriesOrderByWithAggregationInput | saved_repositoriesOrderByWithAggregationInput[]
    by: Saved_repositoriesScalarFieldEnum[] | Saved_repositoriesScalarFieldEnum
    having?: saved_repositoriesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Saved_repositoriesCountAggregateInputType | true
    _avg?: Saved_repositoriesAvgAggregateInputType
    _sum?: Saved_repositoriesSumAggregateInputType
    _min?: Saved_repositoriesMinAggregateInputType
    _max?: Saved_repositoriesMaxAggregateInputType
  }

  export type Saved_repositoriesGroupByOutputType = {
    id: string
    user_id: string
    repository_id: bigint
    created_at: Date | null
    _count: Saved_repositoriesCountAggregateOutputType | null
    _avg: Saved_repositoriesAvgAggregateOutputType | null
    _sum: Saved_repositoriesSumAggregateOutputType | null
    _min: Saved_repositoriesMinAggregateOutputType | null
    _max: Saved_repositoriesMaxAggregateOutputType | null
  }

  type GetSaved_repositoriesGroupByPayload<T extends saved_repositoriesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Saved_repositoriesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Saved_repositoriesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Saved_repositoriesGroupByOutputType[P]>
            : GetScalarType<T[P], Saved_repositoriesGroupByOutputType[P]>
        }
      >
    >


  export type saved_repositoriesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    repository_id?: boolean
    created_at?: boolean
    user?: boolean | profilesDefaultArgs<ExtArgs>
    repository?: boolean | repositoriesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["saved_repositories"]>

  export type saved_repositoriesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    repository_id?: boolean
    created_at?: boolean
    user?: boolean | profilesDefaultArgs<ExtArgs>
    repository?: boolean | repositoriesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["saved_repositories"]>

  export type saved_repositoriesSelectScalar = {
    id?: boolean
    user_id?: boolean
    repository_id?: boolean
    created_at?: boolean
  }

  export type saved_repositoriesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | profilesDefaultArgs<ExtArgs>
    repository?: boolean | repositoriesDefaultArgs<ExtArgs>
  }
  export type saved_repositoriesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | profilesDefaultArgs<ExtArgs>
    repository?: boolean | repositoriesDefaultArgs<ExtArgs>
  }

  export type $saved_repositoriesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "saved_repositories"
    objects: {
      user: Prisma.$profilesPayload<ExtArgs>
      repository: Prisma.$repositoriesPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      repository_id: bigint
      created_at: Date | null
    }, ExtArgs["result"]["saved_repositories"]>
    composites: {}
  }

  type saved_repositoriesGetPayload<S extends boolean | null | undefined | saved_repositoriesDefaultArgs> = $Result.GetResult<Prisma.$saved_repositoriesPayload, S>

  type saved_repositoriesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<saved_repositoriesFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: Saved_repositoriesCountAggregateInputType | true
    }

  export interface saved_repositoriesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['saved_repositories'], meta: { name: 'saved_repositories' } }
    /**
     * Find zero or one Saved_repositories that matches the filter.
     * @param {saved_repositoriesFindUniqueArgs} args - Arguments to find a Saved_repositories
     * @example
     * // Get one Saved_repositories
     * const saved_repositories = await prisma.saved_repositories.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends saved_repositoriesFindUniqueArgs>(args: SelectSubset<T, saved_repositoriesFindUniqueArgs<ExtArgs>>): Prisma__saved_repositoriesClient<$Result.GetResult<Prisma.$saved_repositoriesPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Saved_repositories that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {saved_repositoriesFindUniqueOrThrowArgs} args - Arguments to find a Saved_repositories
     * @example
     * // Get one Saved_repositories
     * const saved_repositories = await prisma.saved_repositories.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends saved_repositoriesFindUniqueOrThrowArgs>(args: SelectSubset<T, saved_repositoriesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__saved_repositoriesClient<$Result.GetResult<Prisma.$saved_repositoriesPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Saved_repositories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {saved_repositoriesFindFirstArgs} args - Arguments to find a Saved_repositories
     * @example
     * // Get one Saved_repositories
     * const saved_repositories = await prisma.saved_repositories.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends saved_repositoriesFindFirstArgs>(args?: SelectSubset<T, saved_repositoriesFindFirstArgs<ExtArgs>>): Prisma__saved_repositoriesClient<$Result.GetResult<Prisma.$saved_repositoriesPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Saved_repositories that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {saved_repositoriesFindFirstOrThrowArgs} args - Arguments to find a Saved_repositories
     * @example
     * // Get one Saved_repositories
     * const saved_repositories = await prisma.saved_repositories.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends saved_repositoriesFindFirstOrThrowArgs>(args?: SelectSubset<T, saved_repositoriesFindFirstOrThrowArgs<ExtArgs>>): Prisma__saved_repositoriesClient<$Result.GetResult<Prisma.$saved_repositoriesPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Saved_repositories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {saved_repositoriesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Saved_repositories
     * const saved_repositories = await prisma.saved_repositories.findMany()
     * 
     * // Get first 10 Saved_repositories
     * const saved_repositories = await prisma.saved_repositories.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const saved_repositoriesWithIdOnly = await prisma.saved_repositories.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends saved_repositoriesFindManyArgs>(args?: SelectSubset<T, saved_repositoriesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$saved_repositoriesPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Saved_repositories.
     * @param {saved_repositoriesCreateArgs} args - Arguments to create a Saved_repositories.
     * @example
     * // Create one Saved_repositories
     * const Saved_repositories = await prisma.saved_repositories.create({
     *   data: {
     *     // ... data to create a Saved_repositories
     *   }
     * })
     * 
     */
    create<T extends saved_repositoriesCreateArgs>(args: SelectSubset<T, saved_repositoriesCreateArgs<ExtArgs>>): Prisma__saved_repositoriesClient<$Result.GetResult<Prisma.$saved_repositoriesPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Saved_repositories.
     * @param {saved_repositoriesCreateManyArgs} args - Arguments to create many Saved_repositories.
     * @example
     * // Create many Saved_repositories
     * const saved_repositories = await prisma.saved_repositories.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends saved_repositoriesCreateManyArgs>(args?: SelectSubset<T, saved_repositoriesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Saved_repositories and returns the data saved in the database.
     * @param {saved_repositoriesCreateManyAndReturnArgs} args - Arguments to create many Saved_repositories.
     * @example
     * // Create many Saved_repositories
     * const saved_repositories = await prisma.saved_repositories.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Saved_repositories and only return the `id`
     * const saved_repositoriesWithIdOnly = await prisma.saved_repositories.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends saved_repositoriesCreateManyAndReturnArgs>(args?: SelectSubset<T, saved_repositoriesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$saved_repositoriesPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Saved_repositories.
     * @param {saved_repositoriesDeleteArgs} args - Arguments to delete one Saved_repositories.
     * @example
     * // Delete one Saved_repositories
     * const Saved_repositories = await prisma.saved_repositories.delete({
     *   where: {
     *     // ... filter to delete one Saved_repositories
     *   }
     * })
     * 
     */
    delete<T extends saved_repositoriesDeleteArgs>(args: SelectSubset<T, saved_repositoriesDeleteArgs<ExtArgs>>): Prisma__saved_repositoriesClient<$Result.GetResult<Prisma.$saved_repositoriesPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Saved_repositories.
     * @param {saved_repositoriesUpdateArgs} args - Arguments to update one Saved_repositories.
     * @example
     * // Update one Saved_repositories
     * const saved_repositories = await prisma.saved_repositories.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends saved_repositoriesUpdateArgs>(args: SelectSubset<T, saved_repositoriesUpdateArgs<ExtArgs>>): Prisma__saved_repositoriesClient<$Result.GetResult<Prisma.$saved_repositoriesPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Saved_repositories.
     * @param {saved_repositoriesDeleteManyArgs} args - Arguments to filter Saved_repositories to delete.
     * @example
     * // Delete a few Saved_repositories
     * const { count } = await prisma.saved_repositories.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends saved_repositoriesDeleteManyArgs>(args?: SelectSubset<T, saved_repositoriesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Saved_repositories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {saved_repositoriesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Saved_repositories
     * const saved_repositories = await prisma.saved_repositories.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends saved_repositoriesUpdateManyArgs>(args: SelectSubset<T, saved_repositoriesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Saved_repositories.
     * @param {saved_repositoriesUpsertArgs} args - Arguments to update or create a Saved_repositories.
     * @example
     * // Update or create a Saved_repositories
     * const saved_repositories = await prisma.saved_repositories.upsert({
     *   create: {
     *     // ... data to create a Saved_repositories
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Saved_repositories we want to update
     *   }
     * })
     */
    upsert<T extends saved_repositoriesUpsertArgs>(args: SelectSubset<T, saved_repositoriesUpsertArgs<ExtArgs>>): Prisma__saved_repositoriesClient<$Result.GetResult<Prisma.$saved_repositoriesPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Saved_repositories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {saved_repositoriesCountArgs} args - Arguments to filter Saved_repositories to count.
     * @example
     * // Count the number of Saved_repositories
     * const count = await prisma.saved_repositories.count({
     *   where: {
     *     // ... the filter for the Saved_repositories we want to count
     *   }
     * })
    **/
    count<T extends saved_repositoriesCountArgs>(
      args?: Subset<T, saved_repositoriesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Saved_repositoriesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Saved_repositories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Saved_repositoriesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Saved_repositoriesAggregateArgs>(args: Subset<T, Saved_repositoriesAggregateArgs>): Prisma.PrismaPromise<GetSaved_repositoriesAggregateType<T>>

    /**
     * Group by Saved_repositories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {saved_repositoriesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends saved_repositoriesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: saved_repositoriesGroupByArgs['orderBy'] }
        : { orderBy?: saved_repositoriesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, saved_repositoriesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSaved_repositoriesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the saved_repositories model
   */
  readonly fields: saved_repositoriesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for saved_repositories.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__saved_repositoriesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends profilesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, profilesDefaultArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    repository<T extends repositoriesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, repositoriesDefaultArgs<ExtArgs>>): Prisma__repositoriesClient<$Result.GetResult<Prisma.$repositoriesPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the saved_repositories model
   */ 
  interface saved_repositoriesFieldRefs {
    readonly id: FieldRef<"saved_repositories", 'String'>
    readonly user_id: FieldRef<"saved_repositories", 'String'>
    readonly repository_id: FieldRef<"saved_repositories", 'BigInt'>
    readonly created_at: FieldRef<"saved_repositories", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * saved_repositories findUnique
   */
  export type saved_repositoriesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saved_repositories
     */
    select?: saved_repositoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saved_repositoriesInclude<ExtArgs> | null
    /**
     * Filter, which saved_repositories to fetch.
     */
    where: saved_repositoriesWhereUniqueInput
  }

  /**
   * saved_repositories findUniqueOrThrow
   */
  export type saved_repositoriesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saved_repositories
     */
    select?: saved_repositoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saved_repositoriesInclude<ExtArgs> | null
    /**
     * Filter, which saved_repositories to fetch.
     */
    where: saved_repositoriesWhereUniqueInput
  }

  /**
   * saved_repositories findFirst
   */
  export type saved_repositoriesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saved_repositories
     */
    select?: saved_repositoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saved_repositoriesInclude<ExtArgs> | null
    /**
     * Filter, which saved_repositories to fetch.
     */
    where?: saved_repositoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of saved_repositories to fetch.
     */
    orderBy?: saved_repositoriesOrderByWithRelationInput | saved_repositoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for saved_repositories.
     */
    cursor?: saved_repositoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` saved_repositories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` saved_repositories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of saved_repositories.
     */
    distinct?: Saved_repositoriesScalarFieldEnum | Saved_repositoriesScalarFieldEnum[]
  }

  /**
   * saved_repositories findFirstOrThrow
   */
  export type saved_repositoriesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saved_repositories
     */
    select?: saved_repositoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saved_repositoriesInclude<ExtArgs> | null
    /**
     * Filter, which saved_repositories to fetch.
     */
    where?: saved_repositoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of saved_repositories to fetch.
     */
    orderBy?: saved_repositoriesOrderByWithRelationInput | saved_repositoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for saved_repositories.
     */
    cursor?: saved_repositoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` saved_repositories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` saved_repositories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of saved_repositories.
     */
    distinct?: Saved_repositoriesScalarFieldEnum | Saved_repositoriesScalarFieldEnum[]
  }

  /**
   * saved_repositories findMany
   */
  export type saved_repositoriesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saved_repositories
     */
    select?: saved_repositoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saved_repositoriesInclude<ExtArgs> | null
    /**
     * Filter, which saved_repositories to fetch.
     */
    where?: saved_repositoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of saved_repositories to fetch.
     */
    orderBy?: saved_repositoriesOrderByWithRelationInput | saved_repositoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing saved_repositories.
     */
    cursor?: saved_repositoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` saved_repositories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` saved_repositories.
     */
    skip?: number
    distinct?: Saved_repositoriesScalarFieldEnum | Saved_repositoriesScalarFieldEnum[]
  }

  /**
   * saved_repositories create
   */
  export type saved_repositoriesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saved_repositories
     */
    select?: saved_repositoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saved_repositoriesInclude<ExtArgs> | null
    /**
     * The data needed to create a saved_repositories.
     */
    data: XOR<saved_repositoriesCreateInput, saved_repositoriesUncheckedCreateInput>
  }

  /**
   * saved_repositories createMany
   */
  export type saved_repositoriesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many saved_repositories.
     */
    data: saved_repositoriesCreateManyInput | saved_repositoriesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * saved_repositories createManyAndReturn
   */
  export type saved_repositoriesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saved_repositories
     */
    select?: saved_repositoriesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many saved_repositories.
     */
    data: saved_repositoriesCreateManyInput | saved_repositoriesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saved_repositoriesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * saved_repositories update
   */
  export type saved_repositoriesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saved_repositories
     */
    select?: saved_repositoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saved_repositoriesInclude<ExtArgs> | null
    /**
     * The data needed to update a saved_repositories.
     */
    data: XOR<saved_repositoriesUpdateInput, saved_repositoriesUncheckedUpdateInput>
    /**
     * Choose, which saved_repositories to update.
     */
    where: saved_repositoriesWhereUniqueInput
  }

  /**
   * saved_repositories updateMany
   */
  export type saved_repositoriesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update saved_repositories.
     */
    data: XOR<saved_repositoriesUpdateManyMutationInput, saved_repositoriesUncheckedUpdateManyInput>
    /**
     * Filter which saved_repositories to update
     */
    where?: saved_repositoriesWhereInput
  }

  /**
   * saved_repositories upsert
   */
  export type saved_repositoriesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saved_repositories
     */
    select?: saved_repositoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saved_repositoriesInclude<ExtArgs> | null
    /**
     * The filter to search for the saved_repositories to update in case it exists.
     */
    where: saved_repositoriesWhereUniqueInput
    /**
     * In case the saved_repositories found by the `where` argument doesn't exist, create a new saved_repositories with this data.
     */
    create: XOR<saved_repositoriesCreateInput, saved_repositoriesUncheckedCreateInput>
    /**
     * In case the saved_repositories was found with the provided `where` argument, update it with this data.
     */
    update: XOR<saved_repositoriesUpdateInput, saved_repositoriesUncheckedUpdateInput>
  }

  /**
   * saved_repositories delete
   */
  export type saved_repositoriesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saved_repositories
     */
    select?: saved_repositoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saved_repositoriesInclude<ExtArgs> | null
    /**
     * Filter which saved_repositories to delete.
     */
    where: saved_repositoriesWhereUniqueInput
  }

  /**
   * saved_repositories deleteMany
   */
  export type saved_repositoriesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which saved_repositories to delete
     */
    where?: saved_repositoriesWhereInput
  }

  /**
   * saved_repositories without action
   */
  export type saved_repositoriesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saved_repositories
     */
    select?: saved_repositoriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saved_repositoriesInclude<ExtArgs> | null
  }


  /**
   * Model analyses
   */

  export type AggregateAnalyses = {
    _count: AnalysesCountAggregateOutputType | null
    _avg: AnalysesAvgAggregateOutputType | null
    _sum: AnalysesSumAggregateOutputType | null
    _min: AnalysesMinAggregateOutputType | null
    _max: AnalysesMaxAggregateOutputType | null
  }

  export type AnalysesAvgAggregateOutputType = {
    repository_id: number | null
  }

  export type AnalysesSumAggregateOutputType = {
    repository_id: bigint | null
  }

  export type AnalysesMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    repository_id: bigint | null
    mermaid_code: string | null
    explanation: string | null
    created_at: Date | null
  }

  export type AnalysesMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    repository_id: bigint | null
    mermaid_code: string | null
    explanation: string | null
    created_at: Date | null
  }

  export type AnalysesCountAggregateOutputType = {
    id: number
    user_id: number
    repository_id: number
    mermaid_code: number
    explanation: number
    created_at: number
    _all: number
  }


  export type AnalysesAvgAggregateInputType = {
    repository_id?: true
  }

  export type AnalysesSumAggregateInputType = {
    repository_id?: true
  }

  export type AnalysesMinAggregateInputType = {
    id?: true
    user_id?: true
    repository_id?: true
    mermaid_code?: true
    explanation?: true
    created_at?: true
  }

  export type AnalysesMaxAggregateInputType = {
    id?: true
    user_id?: true
    repository_id?: true
    mermaid_code?: true
    explanation?: true
    created_at?: true
  }

  export type AnalysesCountAggregateInputType = {
    id?: true
    user_id?: true
    repository_id?: true
    mermaid_code?: true
    explanation?: true
    created_at?: true
    _all?: true
  }

  export type AnalysesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which analyses to aggregate.
     */
    where?: analysesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of analyses to fetch.
     */
    orderBy?: analysesOrderByWithRelationInput | analysesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: analysesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` analyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` analyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned analyses
    **/
    _count?: true | AnalysesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AnalysesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AnalysesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnalysesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnalysesMaxAggregateInputType
  }

  export type GetAnalysesAggregateType<T extends AnalysesAggregateArgs> = {
        [P in keyof T & keyof AggregateAnalyses]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnalyses[P]>
      : GetScalarType<T[P], AggregateAnalyses[P]>
  }




  export type analysesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: analysesWhereInput
    orderBy?: analysesOrderByWithAggregationInput | analysesOrderByWithAggregationInput[]
    by: AnalysesScalarFieldEnum[] | AnalysesScalarFieldEnum
    having?: analysesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnalysesCountAggregateInputType | true
    _avg?: AnalysesAvgAggregateInputType
    _sum?: AnalysesSumAggregateInputType
    _min?: AnalysesMinAggregateInputType
    _max?: AnalysesMaxAggregateInputType
  }

  export type AnalysesGroupByOutputType = {
    id: string
    user_id: string
    repository_id: bigint
    mermaid_code: string
    explanation: string
    created_at: Date | null
    _count: AnalysesCountAggregateOutputType | null
    _avg: AnalysesAvgAggregateOutputType | null
    _sum: AnalysesSumAggregateOutputType | null
    _min: AnalysesMinAggregateOutputType | null
    _max: AnalysesMaxAggregateOutputType | null
  }

  type GetAnalysesGroupByPayload<T extends analysesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnalysesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnalysesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnalysesGroupByOutputType[P]>
            : GetScalarType<T[P], AnalysesGroupByOutputType[P]>
        }
      >
    >


  export type analysesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    repository_id?: boolean
    mermaid_code?: boolean
    explanation?: boolean
    created_at?: boolean
    user?: boolean | profilesDefaultArgs<ExtArgs>
    repository?: boolean | repositoriesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["analyses"]>

  export type analysesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    repository_id?: boolean
    mermaid_code?: boolean
    explanation?: boolean
    created_at?: boolean
    user?: boolean | profilesDefaultArgs<ExtArgs>
    repository?: boolean | repositoriesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["analyses"]>

  export type analysesSelectScalar = {
    id?: boolean
    user_id?: boolean
    repository_id?: boolean
    mermaid_code?: boolean
    explanation?: boolean
    created_at?: boolean
  }

  export type analysesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | profilesDefaultArgs<ExtArgs>
    repository?: boolean | repositoriesDefaultArgs<ExtArgs>
  }
  export type analysesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | profilesDefaultArgs<ExtArgs>
    repository?: boolean | repositoriesDefaultArgs<ExtArgs>
  }

  export type $analysesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "analyses"
    objects: {
      user: Prisma.$profilesPayload<ExtArgs>
      repository: Prisma.$repositoriesPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      repository_id: bigint
      mermaid_code: string
      explanation: string
      created_at: Date | null
    }, ExtArgs["result"]["analyses"]>
    composites: {}
  }

  type analysesGetPayload<S extends boolean | null | undefined | analysesDefaultArgs> = $Result.GetResult<Prisma.$analysesPayload, S>

  type analysesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<analysesFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AnalysesCountAggregateInputType | true
    }

  export interface analysesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['analyses'], meta: { name: 'analyses' } }
    /**
     * Find zero or one Analyses that matches the filter.
     * @param {analysesFindUniqueArgs} args - Arguments to find a Analyses
     * @example
     * // Get one Analyses
     * const analyses = await prisma.analyses.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends analysesFindUniqueArgs>(args: SelectSubset<T, analysesFindUniqueArgs<ExtArgs>>): Prisma__analysesClient<$Result.GetResult<Prisma.$analysesPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Analyses that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {analysesFindUniqueOrThrowArgs} args - Arguments to find a Analyses
     * @example
     * // Get one Analyses
     * const analyses = await prisma.analyses.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends analysesFindUniqueOrThrowArgs>(args: SelectSubset<T, analysesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__analysesClient<$Result.GetResult<Prisma.$analysesPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Analyses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {analysesFindFirstArgs} args - Arguments to find a Analyses
     * @example
     * // Get one Analyses
     * const analyses = await prisma.analyses.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends analysesFindFirstArgs>(args?: SelectSubset<T, analysesFindFirstArgs<ExtArgs>>): Prisma__analysesClient<$Result.GetResult<Prisma.$analysesPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Analyses that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {analysesFindFirstOrThrowArgs} args - Arguments to find a Analyses
     * @example
     * // Get one Analyses
     * const analyses = await prisma.analyses.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends analysesFindFirstOrThrowArgs>(args?: SelectSubset<T, analysesFindFirstOrThrowArgs<ExtArgs>>): Prisma__analysesClient<$Result.GetResult<Prisma.$analysesPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Analyses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {analysesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Analyses
     * const analyses = await prisma.analyses.findMany()
     * 
     * // Get first 10 Analyses
     * const analyses = await prisma.analyses.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const analysesWithIdOnly = await prisma.analyses.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends analysesFindManyArgs>(args?: SelectSubset<T, analysesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$analysesPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Analyses.
     * @param {analysesCreateArgs} args - Arguments to create a Analyses.
     * @example
     * // Create one Analyses
     * const Analyses = await prisma.analyses.create({
     *   data: {
     *     // ... data to create a Analyses
     *   }
     * })
     * 
     */
    create<T extends analysesCreateArgs>(args: SelectSubset<T, analysesCreateArgs<ExtArgs>>): Prisma__analysesClient<$Result.GetResult<Prisma.$analysesPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Analyses.
     * @param {analysesCreateManyArgs} args - Arguments to create many Analyses.
     * @example
     * // Create many Analyses
     * const analyses = await prisma.analyses.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends analysesCreateManyArgs>(args?: SelectSubset<T, analysesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Analyses and returns the data saved in the database.
     * @param {analysesCreateManyAndReturnArgs} args - Arguments to create many Analyses.
     * @example
     * // Create many Analyses
     * const analyses = await prisma.analyses.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Analyses and only return the `id`
     * const analysesWithIdOnly = await prisma.analyses.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends analysesCreateManyAndReturnArgs>(args?: SelectSubset<T, analysesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$analysesPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Analyses.
     * @param {analysesDeleteArgs} args - Arguments to delete one Analyses.
     * @example
     * // Delete one Analyses
     * const Analyses = await prisma.analyses.delete({
     *   where: {
     *     // ... filter to delete one Analyses
     *   }
     * })
     * 
     */
    delete<T extends analysesDeleteArgs>(args: SelectSubset<T, analysesDeleteArgs<ExtArgs>>): Prisma__analysesClient<$Result.GetResult<Prisma.$analysesPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Analyses.
     * @param {analysesUpdateArgs} args - Arguments to update one Analyses.
     * @example
     * // Update one Analyses
     * const analyses = await prisma.analyses.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends analysesUpdateArgs>(args: SelectSubset<T, analysesUpdateArgs<ExtArgs>>): Prisma__analysesClient<$Result.GetResult<Prisma.$analysesPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Analyses.
     * @param {analysesDeleteManyArgs} args - Arguments to filter Analyses to delete.
     * @example
     * // Delete a few Analyses
     * const { count } = await prisma.analyses.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends analysesDeleteManyArgs>(args?: SelectSubset<T, analysesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Analyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {analysesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Analyses
     * const analyses = await prisma.analyses.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends analysesUpdateManyArgs>(args: SelectSubset<T, analysesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Analyses.
     * @param {analysesUpsertArgs} args - Arguments to update or create a Analyses.
     * @example
     * // Update or create a Analyses
     * const analyses = await prisma.analyses.upsert({
     *   create: {
     *     // ... data to create a Analyses
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Analyses we want to update
     *   }
     * })
     */
    upsert<T extends analysesUpsertArgs>(args: SelectSubset<T, analysesUpsertArgs<ExtArgs>>): Prisma__analysesClient<$Result.GetResult<Prisma.$analysesPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Analyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {analysesCountArgs} args - Arguments to filter Analyses to count.
     * @example
     * // Count the number of Analyses
     * const count = await prisma.analyses.count({
     *   where: {
     *     // ... the filter for the Analyses we want to count
     *   }
     * })
    **/
    count<T extends analysesCountArgs>(
      args?: Subset<T, analysesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnalysesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Analyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnalysesAggregateArgs>(args: Subset<T, AnalysesAggregateArgs>): Prisma.PrismaPromise<GetAnalysesAggregateType<T>>

    /**
     * Group by Analyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {analysesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends analysesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: analysesGroupByArgs['orderBy'] }
        : { orderBy?: analysesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, analysesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnalysesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the analyses model
   */
  readonly fields: analysesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for analyses.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__analysesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends profilesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, profilesDefaultArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    repository<T extends repositoriesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, repositoriesDefaultArgs<ExtArgs>>): Prisma__repositoriesClient<$Result.GetResult<Prisma.$repositoriesPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the analyses model
   */ 
  interface analysesFieldRefs {
    readonly id: FieldRef<"analyses", 'String'>
    readonly user_id: FieldRef<"analyses", 'String'>
    readonly repository_id: FieldRef<"analyses", 'BigInt'>
    readonly mermaid_code: FieldRef<"analyses", 'String'>
    readonly explanation: FieldRef<"analyses", 'String'>
    readonly created_at: FieldRef<"analyses", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * analyses findUnique
   */
  export type analysesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the analyses
     */
    select?: analysesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: analysesInclude<ExtArgs> | null
    /**
     * Filter, which analyses to fetch.
     */
    where: analysesWhereUniqueInput
  }

  /**
   * analyses findUniqueOrThrow
   */
  export type analysesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the analyses
     */
    select?: analysesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: analysesInclude<ExtArgs> | null
    /**
     * Filter, which analyses to fetch.
     */
    where: analysesWhereUniqueInput
  }

  /**
   * analyses findFirst
   */
  export type analysesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the analyses
     */
    select?: analysesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: analysesInclude<ExtArgs> | null
    /**
     * Filter, which analyses to fetch.
     */
    where?: analysesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of analyses to fetch.
     */
    orderBy?: analysesOrderByWithRelationInput | analysesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for analyses.
     */
    cursor?: analysesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` analyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` analyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of analyses.
     */
    distinct?: AnalysesScalarFieldEnum | AnalysesScalarFieldEnum[]
  }

  /**
   * analyses findFirstOrThrow
   */
  export type analysesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the analyses
     */
    select?: analysesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: analysesInclude<ExtArgs> | null
    /**
     * Filter, which analyses to fetch.
     */
    where?: analysesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of analyses to fetch.
     */
    orderBy?: analysesOrderByWithRelationInput | analysesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for analyses.
     */
    cursor?: analysesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` analyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` analyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of analyses.
     */
    distinct?: AnalysesScalarFieldEnum | AnalysesScalarFieldEnum[]
  }

  /**
   * analyses findMany
   */
  export type analysesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the analyses
     */
    select?: analysesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: analysesInclude<ExtArgs> | null
    /**
     * Filter, which analyses to fetch.
     */
    where?: analysesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of analyses to fetch.
     */
    orderBy?: analysesOrderByWithRelationInput | analysesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing analyses.
     */
    cursor?: analysesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` analyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` analyses.
     */
    skip?: number
    distinct?: AnalysesScalarFieldEnum | AnalysesScalarFieldEnum[]
  }

  /**
   * analyses create
   */
  export type analysesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the analyses
     */
    select?: analysesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: analysesInclude<ExtArgs> | null
    /**
     * The data needed to create a analyses.
     */
    data: XOR<analysesCreateInput, analysesUncheckedCreateInput>
  }

  /**
   * analyses createMany
   */
  export type analysesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many analyses.
     */
    data: analysesCreateManyInput | analysesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * analyses createManyAndReturn
   */
  export type analysesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the analyses
     */
    select?: analysesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many analyses.
     */
    data: analysesCreateManyInput | analysesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: analysesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * analyses update
   */
  export type analysesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the analyses
     */
    select?: analysesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: analysesInclude<ExtArgs> | null
    /**
     * The data needed to update a analyses.
     */
    data: XOR<analysesUpdateInput, analysesUncheckedUpdateInput>
    /**
     * Choose, which analyses to update.
     */
    where: analysesWhereUniqueInput
  }

  /**
   * analyses updateMany
   */
  export type analysesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update analyses.
     */
    data: XOR<analysesUpdateManyMutationInput, analysesUncheckedUpdateManyInput>
    /**
     * Filter which analyses to update
     */
    where?: analysesWhereInput
  }

  /**
   * analyses upsert
   */
  export type analysesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the analyses
     */
    select?: analysesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: analysesInclude<ExtArgs> | null
    /**
     * The filter to search for the analyses to update in case it exists.
     */
    where: analysesWhereUniqueInput
    /**
     * In case the analyses found by the `where` argument doesn't exist, create a new analyses with this data.
     */
    create: XOR<analysesCreateInput, analysesUncheckedCreateInput>
    /**
     * In case the analyses was found with the provided `where` argument, update it with this data.
     */
    update: XOR<analysesUpdateInput, analysesUncheckedUpdateInput>
  }

  /**
   * analyses delete
   */
  export type analysesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the analyses
     */
    select?: analysesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: analysesInclude<ExtArgs> | null
    /**
     * Filter which analyses to delete.
     */
    where: analysesWhereUniqueInput
  }

  /**
   * analyses deleteMany
   */
  export type analysesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which analyses to delete
     */
    where?: analysesWhereInput
  }

  /**
   * analyses without action
   */
  export type analysesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the analyses
     */
    select?: analysesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: analysesInclude<ExtArgs> | null
  }


  /**
   * Model user_roles
   */

  export type AggregateUser_roles = {
    _count: User_rolesCountAggregateOutputType | null
    _min: User_rolesMinAggregateOutputType | null
    _max: User_rolesMaxAggregateOutputType | null
  }

  export type User_rolesMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    role: $Enums.app_role | null
    created_at: Date | null
  }

  export type User_rolesMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    role: $Enums.app_role | null
    created_at: Date | null
  }

  export type User_rolesCountAggregateOutputType = {
    id: number
    user_id: number
    role: number
    created_at: number
    _all: number
  }


  export type User_rolesMinAggregateInputType = {
    id?: true
    user_id?: true
    role?: true
    created_at?: true
  }

  export type User_rolesMaxAggregateInputType = {
    id?: true
    user_id?: true
    role?: true
    created_at?: true
  }

  export type User_rolesCountAggregateInputType = {
    id?: true
    user_id?: true
    role?: true
    created_at?: true
    _all?: true
  }

  export type User_rolesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_roles to aggregate.
     */
    where?: user_rolesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_roles to fetch.
     */
    orderBy?: user_rolesOrderByWithRelationInput | user_rolesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: user_rolesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned user_roles
    **/
    _count?: true | User_rolesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: User_rolesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: User_rolesMaxAggregateInputType
  }

  export type GetUser_rolesAggregateType<T extends User_rolesAggregateArgs> = {
        [P in keyof T & keyof AggregateUser_roles]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser_roles[P]>
      : GetScalarType<T[P], AggregateUser_roles[P]>
  }




  export type user_rolesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: user_rolesWhereInput
    orderBy?: user_rolesOrderByWithAggregationInput | user_rolesOrderByWithAggregationInput[]
    by: User_rolesScalarFieldEnum[] | User_rolesScalarFieldEnum
    having?: user_rolesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: User_rolesCountAggregateInputType | true
    _min?: User_rolesMinAggregateInputType
    _max?: User_rolesMaxAggregateInputType
  }

  export type User_rolesGroupByOutputType = {
    id: string
    user_id: string
    role: $Enums.app_role
    created_at: Date | null
    _count: User_rolesCountAggregateOutputType | null
    _min: User_rolesMinAggregateOutputType | null
    _max: User_rolesMaxAggregateOutputType | null
  }

  type GetUser_rolesGroupByPayload<T extends user_rolesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<User_rolesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof User_rolesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], User_rolesGroupByOutputType[P]>
            : GetScalarType<T[P], User_rolesGroupByOutputType[P]>
        }
      >
    >


  export type user_rolesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    role?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["user_roles"]>

  export type user_rolesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    role?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["user_roles"]>

  export type user_rolesSelectScalar = {
    id?: boolean
    user_id?: boolean
    role?: boolean
    created_at?: boolean
  }


  export type $user_rolesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "user_roles"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      role: $Enums.app_role
      created_at: Date | null
    }, ExtArgs["result"]["user_roles"]>
    composites: {}
  }

  type user_rolesGetPayload<S extends boolean | null | undefined | user_rolesDefaultArgs> = $Result.GetResult<Prisma.$user_rolesPayload, S>

  type user_rolesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<user_rolesFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: User_rolesCountAggregateInputType | true
    }

  export interface user_rolesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user_roles'], meta: { name: 'user_roles' } }
    /**
     * Find zero or one User_roles that matches the filter.
     * @param {user_rolesFindUniqueArgs} args - Arguments to find a User_roles
     * @example
     * // Get one User_roles
     * const user_roles = await prisma.user_roles.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends user_rolesFindUniqueArgs>(args: SelectSubset<T, user_rolesFindUniqueArgs<ExtArgs>>): Prisma__user_rolesClient<$Result.GetResult<Prisma.$user_rolesPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User_roles that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {user_rolesFindUniqueOrThrowArgs} args - Arguments to find a User_roles
     * @example
     * // Get one User_roles
     * const user_roles = await prisma.user_roles.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends user_rolesFindUniqueOrThrowArgs>(args: SelectSubset<T, user_rolesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__user_rolesClient<$Result.GetResult<Prisma.$user_rolesPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User_roles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_rolesFindFirstArgs} args - Arguments to find a User_roles
     * @example
     * // Get one User_roles
     * const user_roles = await prisma.user_roles.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends user_rolesFindFirstArgs>(args?: SelectSubset<T, user_rolesFindFirstArgs<ExtArgs>>): Prisma__user_rolesClient<$Result.GetResult<Prisma.$user_rolesPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User_roles that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_rolesFindFirstOrThrowArgs} args - Arguments to find a User_roles
     * @example
     * // Get one User_roles
     * const user_roles = await prisma.user_roles.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends user_rolesFindFirstOrThrowArgs>(args?: SelectSubset<T, user_rolesFindFirstOrThrowArgs<ExtArgs>>): Prisma__user_rolesClient<$Result.GetResult<Prisma.$user_rolesPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more User_roles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_rolesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all User_roles
     * const user_roles = await prisma.user_roles.findMany()
     * 
     * // Get first 10 User_roles
     * const user_roles = await prisma.user_roles.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const user_rolesWithIdOnly = await prisma.user_roles.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends user_rolesFindManyArgs>(args?: SelectSubset<T, user_rolesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_rolesPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User_roles.
     * @param {user_rolesCreateArgs} args - Arguments to create a User_roles.
     * @example
     * // Create one User_roles
     * const User_roles = await prisma.user_roles.create({
     *   data: {
     *     // ... data to create a User_roles
     *   }
     * })
     * 
     */
    create<T extends user_rolesCreateArgs>(args: SelectSubset<T, user_rolesCreateArgs<ExtArgs>>): Prisma__user_rolesClient<$Result.GetResult<Prisma.$user_rolesPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many User_roles.
     * @param {user_rolesCreateManyArgs} args - Arguments to create many User_roles.
     * @example
     * // Create many User_roles
     * const user_roles = await prisma.user_roles.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends user_rolesCreateManyArgs>(args?: SelectSubset<T, user_rolesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many User_roles and returns the data saved in the database.
     * @param {user_rolesCreateManyAndReturnArgs} args - Arguments to create many User_roles.
     * @example
     * // Create many User_roles
     * const user_roles = await prisma.user_roles.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many User_roles and only return the `id`
     * const user_rolesWithIdOnly = await prisma.user_roles.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends user_rolesCreateManyAndReturnArgs>(args?: SelectSubset<T, user_rolesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_rolesPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User_roles.
     * @param {user_rolesDeleteArgs} args - Arguments to delete one User_roles.
     * @example
     * // Delete one User_roles
     * const User_roles = await prisma.user_roles.delete({
     *   where: {
     *     // ... filter to delete one User_roles
     *   }
     * })
     * 
     */
    delete<T extends user_rolesDeleteArgs>(args: SelectSubset<T, user_rolesDeleteArgs<ExtArgs>>): Prisma__user_rolesClient<$Result.GetResult<Prisma.$user_rolesPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User_roles.
     * @param {user_rolesUpdateArgs} args - Arguments to update one User_roles.
     * @example
     * // Update one User_roles
     * const user_roles = await prisma.user_roles.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends user_rolesUpdateArgs>(args: SelectSubset<T, user_rolesUpdateArgs<ExtArgs>>): Prisma__user_rolesClient<$Result.GetResult<Prisma.$user_rolesPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more User_roles.
     * @param {user_rolesDeleteManyArgs} args - Arguments to filter User_roles to delete.
     * @example
     * // Delete a few User_roles
     * const { count } = await prisma.user_roles.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends user_rolesDeleteManyArgs>(args?: SelectSubset<T, user_rolesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more User_roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_rolesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many User_roles
     * const user_roles = await prisma.user_roles.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends user_rolesUpdateManyArgs>(args: SelectSubset<T, user_rolesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User_roles.
     * @param {user_rolesUpsertArgs} args - Arguments to update or create a User_roles.
     * @example
     * // Update or create a User_roles
     * const user_roles = await prisma.user_roles.upsert({
     *   create: {
     *     // ... data to create a User_roles
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User_roles we want to update
     *   }
     * })
     */
    upsert<T extends user_rolesUpsertArgs>(args: SelectSubset<T, user_rolesUpsertArgs<ExtArgs>>): Prisma__user_rolesClient<$Result.GetResult<Prisma.$user_rolesPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of User_roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_rolesCountArgs} args - Arguments to filter User_roles to count.
     * @example
     * // Count the number of User_roles
     * const count = await prisma.user_roles.count({
     *   where: {
     *     // ... the filter for the User_roles we want to count
     *   }
     * })
    **/
    count<T extends user_rolesCountArgs>(
      args?: Subset<T, user_rolesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], User_rolesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User_roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_rolesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends User_rolesAggregateArgs>(args: Subset<T, User_rolesAggregateArgs>): Prisma.PrismaPromise<GetUser_rolesAggregateType<T>>

    /**
     * Group by User_roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_rolesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends user_rolesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: user_rolesGroupByArgs['orderBy'] }
        : { orderBy?: user_rolesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, user_rolesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUser_rolesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the user_roles model
   */
  readonly fields: user_rolesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for user_roles.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__user_rolesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the user_roles model
   */ 
  interface user_rolesFieldRefs {
    readonly id: FieldRef<"user_roles", 'String'>
    readonly user_id: FieldRef<"user_roles", 'String'>
    readonly role: FieldRef<"user_roles", 'app_role'>
    readonly created_at: FieldRef<"user_roles", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * user_roles findUnique
   */
  export type user_rolesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_roles
     */
    select?: user_rolesSelect<ExtArgs> | null
    /**
     * Filter, which user_roles to fetch.
     */
    where: user_rolesWhereUniqueInput
  }

  /**
   * user_roles findUniqueOrThrow
   */
  export type user_rolesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_roles
     */
    select?: user_rolesSelect<ExtArgs> | null
    /**
     * Filter, which user_roles to fetch.
     */
    where: user_rolesWhereUniqueInput
  }

  /**
   * user_roles findFirst
   */
  export type user_rolesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_roles
     */
    select?: user_rolesSelect<ExtArgs> | null
    /**
     * Filter, which user_roles to fetch.
     */
    where?: user_rolesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_roles to fetch.
     */
    orderBy?: user_rolesOrderByWithRelationInput | user_rolesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_roles.
     */
    cursor?: user_rolesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_roles.
     */
    distinct?: User_rolesScalarFieldEnum | User_rolesScalarFieldEnum[]
  }

  /**
   * user_roles findFirstOrThrow
   */
  export type user_rolesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_roles
     */
    select?: user_rolesSelect<ExtArgs> | null
    /**
     * Filter, which user_roles to fetch.
     */
    where?: user_rolesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_roles to fetch.
     */
    orderBy?: user_rolesOrderByWithRelationInput | user_rolesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_roles.
     */
    cursor?: user_rolesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_roles.
     */
    distinct?: User_rolesScalarFieldEnum | User_rolesScalarFieldEnum[]
  }

  /**
   * user_roles findMany
   */
  export type user_rolesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_roles
     */
    select?: user_rolesSelect<ExtArgs> | null
    /**
     * Filter, which user_roles to fetch.
     */
    where?: user_rolesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_roles to fetch.
     */
    orderBy?: user_rolesOrderByWithRelationInput | user_rolesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing user_roles.
     */
    cursor?: user_rolesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_roles.
     */
    skip?: number
    distinct?: User_rolesScalarFieldEnum | User_rolesScalarFieldEnum[]
  }

  /**
   * user_roles create
   */
  export type user_rolesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_roles
     */
    select?: user_rolesSelect<ExtArgs> | null
    /**
     * The data needed to create a user_roles.
     */
    data: XOR<user_rolesCreateInput, user_rolesUncheckedCreateInput>
  }

  /**
   * user_roles createMany
   */
  export type user_rolesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many user_roles.
     */
    data: user_rolesCreateManyInput | user_rolesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * user_roles createManyAndReturn
   */
  export type user_rolesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_roles
     */
    select?: user_rolesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many user_roles.
     */
    data: user_rolesCreateManyInput | user_rolesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * user_roles update
   */
  export type user_rolesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_roles
     */
    select?: user_rolesSelect<ExtArgs> | null
    /**
     * The data needed to update a user_roles.
     */
    data: XOR<user_rolesUpdateInput, user_rolesUncheckedUpdateInput>
    /**
     * Choose, which user_roles to update.
     */
    where: user_rolesWhereUniqueInput
  }

  /**
   * user_roles updateMany
   */
  export type user_rolesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update user_roles.
     */
    data: XOR<user_rolesUpdateManyMutationInput, user_rolesUncheckedUpdateManyInput>
    /**
     * Filter which user_roles to update
     */
    where?: user_rolesWhereInput
  }

  /**
   * user_roles upsert
   */
  export type user_rolesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_roles
     */
    select?: user_rolesSelect<ExtArgs> | null
    /**
     * The filter to search for the user_roles to update in case it exists.
     */
    where: user_rolesWhereUniqueInput
    /**
     * In case the user_roles found by the `where` argument doesn't exist, create a new user_roles with this data.
     */
    create: XOR<user_rolesCreateInput, user_rolesUncheckedCreateInput>
    /**
     * In case the user_roles was found with the provided `where` argument, update it with this data.
     */
    update: XOR<user_rolesUpdateInput, user_rolesUncheckedUpdateInput>
  }

  /**
   * user_roles delete
   */
  export type user_rolesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_roles
     */
    select?: user_rolesSelect<ExtArgs> | null
    /**
     * Filter which user_roles to delete.
     */
    where: user_rolesWhereUniqueInput
  }

  /**
   * user_roles deleteMany
   */
  export type user_rolesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_roles to delete
     */
    where?: user_rolesWhereInput
  }

  /**
   * user_roles without action
   */
  export type user_rolesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_roles
     */
    select?: user_rolesSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ProfilesScalarFieldEnum: {
    id: 'id',
    email: 'email',
    full_name: 'full_name',
    avatar_url: 'avatar_url',
    bio: 'bio',
    github_username: 'github_username',
    experience_level: 'experience_level',
    tech_interests: 'tech_interests',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ProfilesScalarFieldEnum = (typeof ProfilesScalarFieldEnum)[keyof typeof ProfilesScalarFieldEnum]


  export const RepositoriesScalarFieldEnum: {
    id: 'id',
    full_name: 'full_name',
    data: 'data',
    last_analyzed: 'last_analyzed',
    created_at: 'created_at'
  };

  export type RepositoriesScalarFieldEnum = (typeof RepositoriesScalarFieldEnum)[keyof typeof RepositoriesScalarFieldEnum]


  export const Saved_repositoriesScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    repository_id: 'repository_id',
    created_at: 'created_at'
  };

  export type Saved_repositoriesScalarFieldEnum = (typeof Saved_repositoriesScalarFieldEnum)[keyof typeof Saved_repositoriesScalarFieldEnum]


  export const AnalysesScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    repository_id: 'repository_id',
    mermaid_code: 'mermaid_code',
    explanation: 'explanation',
    created_at: 'created_at'
  };

  export type AnalysesScalarFieldEnum = (typeof AnalysesScalarFieldEnum)[keyof typeof AnalysesScalarFieldEnum]


  export const User_rolesScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    role: 'role',
    created_at: 'created_at'
  };

  export type User_rolesScalarFieldEnum = (typeof User_rolesScalarFieldEnum)[keyof typeof User_rolesScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'app_role'
   */
  export type Enumapp_roleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'app_role'>
    


  /**
   * Reference to a field of type 'app_role[]'
   */
  export type ListEnumapp_roleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'app_role[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type profilesWhereInput = {
    AND?: profilesWhereInput | profilesWhereInput[]
    OR?: profilesWhereInput[]
    NOT?: profilesWhereInput | profilesWhereInput[]
    id?: StringFilter<"profiles"> | string
    email?: StringNullableFilter<"profiles"> | string | null
    full_name?: StringNullableFilter<"profiles"> | string | null
    avatar_url?: StringNullableFilter<"profiles"> | string | null
    bio?: StringNullableFilter<"profiles"> | string | null
    github_username?: StringNullableFilter<"profiles"> | string | null
    experience_level?: StringNullableFilter<"profiles"> | string | null
    tech_interests?: StringNullableListFilter<"profiles">
    created_at?: DateTimeNullableFilter<"profiles"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"profiles"> | Date | string | null
    saved_repositories?: Saved_repositoriesListRelationFilter
    analyses?: AnalysesListRelationFilter
  }

  export type profilesOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    full_name?: SortOrderInput | SortOrder
    avatar_url?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    github_username?: SortOrderInput | SortOrder
    experience_level?: SortOrderInput | SortOrder
    tech_interests?: SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    saved_repositories?: saved_repositoriesOrderByRelationAggregateInput
    analyses?: analysesOrderByRelationAggregateInput
  }

  export type profilesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: profilesWhereInput | profilesWhereInput[]
    OR?: profilesWhereInput[]
    NOT?: profilesWhereInput | profilesWhereInput[]
    email?: StringNullableFilter<"profiles"> | string | null
    full_name?: StringNullableFilter<"profiles"> | string | null
    avatar_url?: StringNullableFilter<"profiles"> | string | null
    bio?: StringNullableFilter<"profiles"> | string | null
    github_username?: StringNullableFilter<"profiles"> | string | null
    experience_level?: StringNullableFilter<"profiles"> | string | null
    tech_interests?: StringNullableListFilter<"profiles">
    created_at?: DateTimeNullableFilter<"profiles"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"profiles"> | Date | string | null
    saved_repositories?: Saved_repositoriesListRelationFilter
    analyses?: AnalysesListRelationFilter
  }, "id">

  export type profilesOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    full_name?: SortOrderInput | SortOrder
    avatar_url?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    github_username?: SortOrderInput | SortOrder
    experience_level?: SortOrderInput | SortOrder
    tech_interests?: SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: profilesCountOrderByAggregateInput
    _max?: profilesMaxOrderByAggregateInput
    _min?: profilesMinOrderByAggregateInput
  }

  export type profilesScalarWhereWithAggregatesInput = {
    AND?: profilesScalarWhereWithAggregatesInput | profilesScalarWhereWithAggregatesInput[]
    OR?: profilesScalarWhereWithAggregatesInput[]
    NOT?: profilesScalarWhereWithAggregatesInput | profilesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"profiles"> | string
    email?: StringNullableWithAggregatesFilter<"profiles"> | string | null
    full_name?: StringNullableWithAggregatesFilter<"profiles"> | string | null
    avatar_url?: StringNullableWithAggregatesFilter<"profiles"> | string | null
    bio?: StringNullableWithAggregatesFilter<"profiles"> | string | null
    github_username?: StringNullableWithAggregatesFilter<"profiles"> | string | null
    experience_level?: StringNullableWithAggregatesFilter<"profiles"> | string | null
    tech_interests?: StringNullableListFilter<"profiles">
    created_at?: DateTimeNullableWithAggregatesFilter<"profiles"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"profiles"> | Date | string | null
  }

  export type repositoriesWhereInput = {
    AND?: repositoriesWhereInput | repositoriesWhereInput[]
    OR?: repositoriesWhereInput[]
    NOT?: repositoriesWhereInput | repositoriesWhereInput[]
    id?: BigIntFilter<"repositories"> | bigint | number
    full_name?: StringFilter<"repositories"> | string
    data?: JsonFilter<"repositories">
    last_analyzed?: DateTimeNullableFilter<"repositories"> | Date | string | null
    created_at?: DateTimeNullableFilter<"repositories"> | Date | string | null
    saved_by?: Saved_repositoriesListRelationFilter
    analyses?: AnalysesListRelationFilter
  }

  export type repositoriesOrderByWithRelationInput = {
    id?: SortOrder
    full_name?: SortOrder
    data?: SortOrder
    last_analyzed?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    saved_by?: saved_repositoriesOrderByRelationAggregateInput
    analyses?: analysesOrderByRelationAggregateInput
  }

  export type repositoriesWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: repositoriesWhereInput | repositoriesWhereInput[]
    OR?: repositoriesWhereInput[]
    NOT?: repositoriesWhereInput | repositoriesWhereInput[]
    full_name?: StringFilter<"repositories"> | string
    data?: JsonFilter<"repositories">
    last_analyzed?: DateTimeNullableFilter<"repositories"> | Date | string | null
    created_at?: DateTimeNullableFilter<"repositories"> | Date | string | null
    saved_by?: Saved_repositoriesListRelationFilter
    analyses?: AnalysesListRelationFilter
  }, "id">

  export type repositoriesOrderByWithAggregationInput = {
    id?: SortOrder
    full_name?: SortOrder
    data?: SortOrder
    last_analyzed?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: repositoriesCountOrderByAggregateInput
    _avg?: repositoriesAvgOrderByAggregateInput
    _max?: repositoriesMaxOrderByAggregateInput
    _min?: repositoriesMinOrderByAggregateInput
    _sum?: repositoriesSumOrderByAggregateInput
  }

  export type repositoriesScalarWhereWithAggregatesInput = {
    AND?: repositoriesScalarWhereWithAggregatesInput | repositoriesScalarWhereWithAggregatesInput[]
    OR?: repositoriesScalarWhereWithAggregatesInput[]
    NOT?: repositoriesScalarWhereWithAggregatesInput | repositoriesScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"repositories"> | bigint | number
    full_name?: StringWithAggregatesFilter<"repositories"> | string
    data?: JsonWithAggregatesFilter<"repositories">
    last_analyzed?: DateTimeNullableWithAggregatesFilter<"repositories"> | Date | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"repositories"> | Date | string | null
  }

  export type saved_repositoriesWhereInput = {
    AND?: saved_repositoriesWhereInput | saved_repositoriesWhereInput[]
    OR?: saved_repositoriesWhereInput[]
    NOT?: saved_repositoriesWhereInput | saved_repositoriesWhereInput[]
    id?: StringFilter<"saved_repositories"> | string
    user_id?: StringFilter<"saved_repositories"> | string
    repository_id?: BigIntFilter<"saved_repositories"> | bigint | number
    created_at?: DateTimeNullableFilter<"saved_repositories"> | Date | string | null
    user?: XOR<ProfilesRelationFilter, profilesWhereInput>
    repository?: XOR<RepositoriesRelationFilter, repositoriesWhereInput>
  }

  export type saved_repositoriesOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    repository_id?: SortOrder
    created_at?: SortOrderInput | SortOrder
    user?: profilesOrderByWithRelationInput
    repository?: repositoriesOrderByWithRelationInput
  }

  export type saved_repositoriesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    user_id_repository_id?: saved_repositoriesUser_idRepository_idCompoundUniqueInput
    AND?: saved_repositoriesWhereInput | saved_repositoriesWhereInput[]
    OR?: saved_repositoriesWhereInput[]
    NOT?: saved_repositoriesWhereInput | saved_repositoriesWhereInput[]
    user_id?: StringFilter<"saved_repositories"> | string
    repository_id?: BigIntFilter<"saved_repositories"> | bigint | number
    created_at?: DateTimeNullableFilter<"saved_repositories"> | Date | string | null
    user?: XOR<ProfilesRelationFilter, profilesWhereInput>
    repository?: XOR<RepositoriesRelationFilter, repositoriesWhereInput>
  }, "id" | "user_id_repository_id">

  export type saved_repositoriesOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    repository_id?: SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: saved_repositoriesCountOrderByAggregateInput
    _avg?: saved_repositoriesAvgOrderByAggregateInput
    _max?: saved_repositoriesMaxOrderByAggregateInput
    _min?: saved_repositoriesMinOrderByAggregateInput
    _sum?: saved_repositoriesSumOrderByAggregateInput
  }

  export type saved_repositoriesScalarWhereWithAggregatesInput = {
    AND?: saved_repositoriesScalarWhereWithAggregatesInput | saved_repositoriesScalarWhereWithAggregatesInput[]
    OR?: saved_repositoriesScalarWhereWithAggregatesInput[]
    NOT?: saved_repositoriesScalarWhereWithAggregatesInput | saved_repositoriesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"saved_repositories"> | string
    user_id?: StringWithAggregatesFilter<"saved_repositories"> | string
    repository_id?: BigIntWithAggregatesFilter<"saved_repositories"> | bigint | number
    created_at?: DateTimeNullableWithAggregatesFilter<"saved_repositories"> | Date | string | null
  }

  export type analysesWhereInput = {
    AND?: analysesWhereInput | analysesWhereInput[]
    OR?: analysesWhereInput[]
    NOT?: analysesWhereInput | analysesWhereInput[]
    id?: StringFilter<"analyses"> | string
    user_id?: StringFilter<"analyses"> | string
    repository_id?: BigIntFilter<"analyses"> | bigint | number
    mermaid_code?: StringFilter<"analyses"> | string
    explanation?: StringFilter<"analyses"> | string
    created_at?: DateTimeNullableFilter<"analyses"> | Date | string | null
    user?: XOR<ProfilesRelationFilter, profilesWhereInput>
    repository?: XOR<RepositoriesRelationFilter, repositoriesWhereInput>
  }

  export type analysesOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    repository_id?: SortOrder
    mermaid_code?: SortOrder
    explanation?: SortOrder
    created_at?: SortOrderInput | SortOrder
    user?: profilesOrderByWithRelationInput
    repository?: repositoriesOrderByWithRelationInput
  }

  export type analysesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: analysesWhereInput | analysesWhereInput[]
    OR?: analysesWhereInput[]
    NOT?: analysesWhereInput | analysesWhereInput[]
    user_id?: StringFilter<"analyses"> | string
    repository_id?: BigIntFilter<"analyses"> | bigint | number
    mermaid_code?: StringFilter<"analyses"> | string
    explanation?: StringFilter<"analyses"> | string
    created_at?: DateTimeNullableFilter<"analyses"> | Date | string | null
    user?: XOR<ProfilesRelationFilter, profilesWhereInput>
    repository?: XOR<RepositoriesRelationFilter, repositoriesWhereInput>
  }, "id">

  export type analysesOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    repository_id?: SortOrder
    mermaid_code?: SortOrder
    explanation?: SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: analysesCountOrderByAggregateInput
    _avg?: analysesAvgOrderByAggregateInput
    _max?: analysesMaxOrderByAggregateInput
    _min?: analysesMinOrderByAggregateInput
    _sum?: analysesSumOrderByAggregateInput
  }

  export type analysesScalarWhereWithAggregatesInput = {
    AND?: analysesScalarWhereWithAggregatesInput | analysesScalarWhereWithAggregatesInput[]
    OR?: analysesScalarWhereWithAggregatesInput[]
    NOT?: analysesScalarWhereWithAggregatesInput | analysesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"analyses"> | string
    user_id?: StringWithAggregatesFilter<"analyses"> | string
    repository_id?: BigIntWithAggregatesFilter<"analyses"> | bigint | number
    mermaid_code?: StringWithAggregatesFilter<"analyses"> | string
    explanation?: StringWithAggregatesFilter<"analyses"> | string
    created_at?: DateTimeNullableWithAggregatesFilter<"analyses"> | Date | string | null
  }

  export type user_rolesWhereInput = {
    AND?: user_rolesWhereInput | user_rolesWhereInput[]
    OR?: user_rolesWhereInput[]
    NOT?: user_rolesWhereInput | user_rolesWhereInput[]
    id?: StringFilter<"user_roles"> | string
    user_id?: StringFilter<"user_roles"> | string
    role?: Enumapp_roleFilter<"user_roles"> | $Enums.app_role
    created_at?: DateTimeNullableFilter<"user_roles"> | Date | string | null
  }

  export type user_rolesOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    role?: SortOrder
    created_at?: SortOrderInput | SortOrder
  }

  export type user_rolesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: user_rolesWhereInput | user_rolesWhereInput[]
    OR?: user_rolesWhereInput[]
    NOT?: user_rolesWhereInput | user_rolesWhereInput[]
    user_id?: StringFilter<"user_roles"> | string
    role?: Enumapp_roleFilter<"user_roles"> | $Enums.app_role
    created_at?: DateTimeNullableFilter<"user_roles"> | Date | string | null
  }, "id">

  export type user_rolesOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    role?: SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: user_rolesCountOrderByAggregateInput
    _max?: user_rolesMaxOrderByAggregateInput
    _min?: user_rolesMinOrderByAggregateInput
  }

  export type user_rolesScalarWhereWithAggregatesInput = {
    AND?: user_rolesScalarWhereWithAggregatesInput | user_rolesScalarWhereWithAggregatesInput[]
    OR?: user_rolesScalarWhereWithAggregatesInput[]
    NOT?: user_rolesScalarWhereWithAggregatesInput | user_rolesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"user_roles"> | string
    user_id?: StringWithAggregatesFilter<"user_roles"> | string
    role?: Enumapp_roleWithAggregatesFilter<"user_roles"> | $Enums.app_role
    created_at?: DateTimeNullableWithAggregatesFilter<"user_roles"> | Date | string | null
  }

  export type profilesCreateInput = {
    id?: string
    email?: string | null
    full_name?: string | null
    avatar_url?: string | null
    bio?: string | null
    github_username?: string | null
    experience_level?: string | null
    tech_interests?: profilesCreatetech_interestsInput | string[]
    created_at?: Date | string | null
    updated_at?: Date | string | null
    saved_repositories?: saved_repositoriesCreateNestedManyWithoutUserInput
    analyses?: analysesCreateNestedManyWithoutUserInput
  }

  export type profilesUncheckedCreateInput = {
    id?: string
    email?: string | null
    full_name?: string | null
    avatar_url?: string | null
    bio?: string | null
    github_username?: string | null
    experience_level?: string | null
    tech_interests?: profilesCreatetech_interestsInput | string[]
    created_at?: Date | string | null
    updated_at?: Date | string | null
    saved_repositories?: saved_repositoriesUncheckedCreateNestedManyWithoutUserInput
    analyses?: analysesUncheckedCreateNestedManyWithoutUserInput
  }

  export type profilesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    github_username?: NullableStringFieldUpdateOperationsInput | string | null
    experience_level?: NullableStringFieldUpdateOperationsInput | string | null
    tech_interests?: profilesUpdatetech_interestsInput | string[]
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    saved_repositories?: saved_repositoriesUpdateManyWithoutUserNestedInput
    analyses?: analysesUpdateManyWithoutUserNestedInput
  }

  export type profilesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    github_username?: NullableStringFieldUpdateOperationsInput | string | null
    experience_level?: NullableStringFieldUpdateOperationsInput | string | null
    tech_interests?: profilesUpdatetech_interestsInput | string[]
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    saved_repositories?: saved_repositoriesUncheckedUpdateManyWithoutUserNestedInput
    analyses?: analysesUncheckedUpdateManyWithoutUserNestedInput
  }

  export type profilesCreateManyInput = {
    id?: string
    email?: string | null
    full_name?: string | null
    avatar_url?: string | null
    bio?: string | null
    github_username?: string | null
    experience_level?: string | null
    tech_interests?: profilesCreatetech_interestsInput | string[]
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type profilesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    github_username?: NullableStringFieldUpdateOperationsInput | string | null
    experience_level?: NullableStringFieldUpdateOperationsInput | string | null
    tech_interests?: profilesUpdatetech_interestsInput | string[]
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type profilesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    github_username?: NullableStringFieldUpdateOperationsInput | string | null
    experience_level?: NullableStringFieldUpdateOperationsInput | string | null
    tech_interests?: profilesUpdatetech_interestsInput | string[]
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type repositoriesCreateInput = {
    id: bigint | number
    full_name: string
    data: JsonNullValueInput | InputJsonValue
    last_analyzed?: Date | string | null
    created_at?: Date | string | null
    saved_by?: saved_repositoriesCreateNestedManyWithoutRepositoryInput
    analyses?: analysesCreateNestedManyWithoutRepositoryInput
  }

  export type repositoriesUncheckedCreateInput = {
    id: bigint | number
    full_name: string
    data: JsonNullValueInput | InputJsonValue
    last_analyzed?: Date | string | null
    created_at?: Date | string | null
    saved_by?: saved_repositoriesUncheckedCreateNestedManyWithoutRepositoryInput
    analyses?: analysesUncheckedCreateNestedManyWithoutRepositoryInput
  }

  export type repositoriesUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    full_name?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    last_analyzed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    saved_by?: saved_repositoriesUpdateManyWithoutRepositoryNestedInput
    analyses?: analysesUpdateManyWithoutRepositoryNestedInput
  }

  export type repositoriesUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    full_name?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    last_analyzed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    saved_by?: saved_repositoriesUncheckedUpdateManyWithoutRepositoryNestedInput
    analyses?: analysesUncheckedUpdateManyWithoutRepositoryNestedInput
  }

  export type repositoriesCreateManyInput = {
    id: bigint | number
    full_name: string
    data: JsonNullValueInput | InputJsonValue
    last_analyzed?: Date | string | null
    created_at?: Date | string | null
  }

  export type repositoriesUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    full_name?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    last_analyzed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type repositoriesUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    full_name?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    last_analyzed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type saved_repositoriesCreateInput = {
    id?: string
    created_at?: Date | string | null
    user: profilesCreateNestedOneWithoutSaved_repositoriesInput
    repository: repositoriesCreateNestedOneWithoutSaved_byInput
  }

  export type saved_repositoriesUncheckedCreateInput = {
    id?: string
    user_id: string
    repository_id: bigint | number
    created_at?: Date | string | null
  }

  export type saved_repositoriesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: profilesUpdateOneRequiredWithoutSaved_repositoriesNestedInput
    repository?: repositoriesUpdateOneRequiredWithoutSaved_byNestedInput
  }

  export type saved_repositoriesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    repository_id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type saved_repositoriesCreateManyInput = {
    id?: string
    user_id: string
    repository_id: bigint | number
    created_at?: Date | string | null
  }

  export type saved_repositoriesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type saved_repositoriesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    repository_id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type analysesCreateInput = {
    id?: string
    mermaid_code: string
    explanation: string
    created_at?: Date | string | null
    user: profilesCreateNestedOneWithoutAnalysesInput
    repository: repositoriesCreateNestedOneWithoutAnalysesInput
  }

  export type analysesUncheckedCreateInput = {
    id?: string
    user_id: string
    repository_id: bigint | number
    mermaid_code: string
    explanation: string
    created_at?: Date | string | null
  }

  export type analysesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mermaid_code?: StringFieldUpdateOperationsInput | string
    explanation?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: profilesUpdateOneRequiredWithoutAnalysesNestedInput
    repository?: repositoriesUpdateOneRequiredWithoutAnalysesNestedInput
  }

  export type analysesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    repository_id?: BigIntFieldUpdateOperationsInput | bigint | number
    mermaid_code?: StringFieldUpdateOperationsInput | string
    explanation?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type analysesCreateManyInput = {
    id?: string
    user_id: string
    repository_id: bigint | number
    mermaid_code: string
    explanation: string
    created_at?: Date | string | null
  }

  export type analysesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    mermaid_code?: StringFieldUpdateOperationsInput | string
    explanation?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type analysesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    repository_id?: BigIntFieldUpdateOperationsInput | bigint | number
    mermaid_code?: StringFieldUpdateOperationsInput | string
    explanation?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type user_rolesCreateInput = {
    id?: string
    user_id: string
    role: $Enums.app_role
    created_at?: Date | string | null
  }

  export type user_rolesUncheckedCreateInput = {
    id?: string
    user_id: string
    role: $Enums.app_role
    created_at?: Date | string | null
  }

  export type user_rolesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    role?: Enumapp_roleFieldUpdateOperationsInput | $Enums.app_role
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type user_rolesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    role?: Enumapp_roleFieldUpdateOperationsInput | $Enums.app_role
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type user_rolesCreateManyInput = {
    id?: string
    user_id: string
    role: $Enums.app_role
    created_at?: Date | string | null
  }

  export type user_rolesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    role?: Enumapp_roleFieldUpdateOperationsInput | $Enums.app_role
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type user_rolesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    role?: Enumapp_roleFieldUpdateOperationsInput | $Enums.app_role
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type Saved_repositoriesListRelationFilter = {
    every?: saved_repositoriesWhereInput
    some?: saved_repositoriesWhereInput
    none?: saved_repositoriesWhereInput
  }

  export type AnalysesListRelationFilter = {
    every?: analysesWhereInput
    some?: analysesWhereInput
    none?: analysesWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type saved_repositoriesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type analysesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type profilesCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    full_name?: SortOrder
    avatar_url?: SortOrder
    bio?: SortOrder
    github_username?: SortOrder
    experience_level?: SortOrder
    tech_interests?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type profilesMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    full_name?: SortOrder
    avatar_url?: SortOrder
    bio?: SortOrder
    github_username?: SortOrder
    experience_level?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type profilesMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    full_name?: SortOrder
    avatar_url?: SortOrder
    bio?: SortOrder
    github_username?: SortOrder
    experience_level?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type repositoriesCountOrderByAggregateInput = {
    id?: SortOrder
    full_name?: SortOrder
    data?: SortOrder
    last_analyzed?: SortOrder
    created_at?: SortOrder
  }

  export type repositoriesAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type repositoriesMaxOrderByAggregateInput = {
    id?: SortOrder
    full_name?: SortOrder
    last_analyzed?: SortOrder
    created_at?: SortOrder
  }

  export type repositoriesMinOrderByAggregateInput = {
    id?: SortOrder
    full_name?: SortOrder
    last_analyzed?: SortOrder
    created_at?: SortOrder
  }

  export type repositoriesSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type ProfilesRelationFilter = {
    is?: profilesWhereInput
    isNot?: profilesWhereInput
  }

  export type RepositoriesRelationFilter = {
    is?: repositoriesWhereInput
    isNot?: repositoriesWhereInput
  }

  export type saved_repositoriesUser_idRepository_idCompoundUniqueInput = {
    user_id: string
    repository_id: bigint | number
  }

  export type saved_repositoriesCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    repository_id?: SortOrder
    created_at?: SortOrder
  }

  export type saved_repositoriesAvgOrderByAggregateInput = {
    repository_id?: SortOrder
  }

  export type saved_repositoriesMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    repository_id?: SortOrder
    created_at?: SortOrder
  }

  export type saved_repositoriesMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    repository_id?: SortOrder
    created_at?: SortOrder
  }

  export type saved_repositoriesSumOrderByAggregateInput = {
    repository_id?: SortOrder
  }

  export type analysesCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    repository_id?: SortOrder
    mermaid_code?: SortOrder
    explanation?: SortOrder
    created_at?: SortOrder
  }

  export type analysesAvgOrderByAggregateInput = {
    repository_id?: SortOrder
  }

  export type analysesMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    repository_id?: SortOrder
    mermaid_code?: SortOrder
    explanation?: SortOrder
    created_at?: SortOrder
  }

  export type analysesMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    repository_id?: SortOrder
    mermaid_code?: SortOrder
    explanation?: SortOrder
    created_at?: SortOrder
  }

  export type analysesSumOrderByAggregateInput = {
    repository_id?: SortOrder
  }

  export type Enumapp_roleFilter<$PrismaModel = never> = {
    equals?: $Enums.app_role | Enumapp_roleFieldRefInput<$PrismaModel>
    in?: $Enums.app_role[] | ListEnumapp_roleFieldRefInput<$PrismaModel>
    notIn?: $Enums.app_role[] | ListEnumapp_roleFieldRefInput<$PrismaModel>
    not?: NestedEnumapp_roleFilter<$PrismaModel> | $Enums.app_role
  }

  export type user_rolesCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
  }

  export type user_rolesMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
  }

  export type user_rolesMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
  }

  export type Enumapp_roleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.app_role | Enumapp_roleFieldRefInput<$PrismaModel>
    in?: $Enums.app_role[] | ListEnumapp_roleFieldRefInput<$PrismaModel>
    notIn?: $Enums.app_role[] | ListEnumapp_roleFieldRefInput<$PrismaModel>
    not?: NestedEnumapp_roleWithAggregatesFilter<$PrismaModel> | $Enums.app_role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumapp_roleFilter<$PrismaModel>
    _max?: NestedEnumapp_roleFilter<$PrismaModel>
  }

  export type profilesCreatetech_interestsInput = {
    set: string[]
  }

  export type saved_repositoriesCreateNestedManyWithoutUserInput = {
    create?: XOR<saved_repositoriesCreateWithoutUserInput, saved_repositoriesUncheckedCreateWithoutUserInput> | saved_repositoriesCreateWithoutUserInput[] | saved_repositoriesUncheckedCreateWithoutUserInput[]
    connectOrCreate?: saved_repositoriesCreateOrConnectWithoutUserInput | saved_repositoriesCreateOrConnectWithoutUserInput[]
    createMany?: saved_repositoriesCreateManyUserInputEnvelope
    connect?: saved_repositoriesWhereUniqueInput | saved_repositoriesWhereUniqueInput[]
  }

  export type analysesCreateNestedManyWithoutUserInput = {
    create?: XOR<analysesCreateWithoutUserInput, analysesUncheckedCreateWithoutUserInput> | analysesCreateWithoutUserInput[] | analysesUncheckedCreateWithoutUserInput[]
    connectOrCreate?: analysesCreateOrConnectWithoutUserInput | analysesCreateOrConnectWithoutUserInput[]
    createMany?: analysesCreateManyUserInputEnvelope
    connect?: analysesWhereUniqueInput | analysesWhereUniqueInput[]
  }

  export type saved_repositoriesUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<saved_repositoriesCreateWithoutUserInput, saved_repositoriesUncheckedCreateWithoutUserInput> | saved_repositoriesCreateWithoutUserInput[] | saved_repositoriesUncheckedCreateWithoutUserInput[]
    connectOrCreate?: saved_repositoriesCreateOrConnectWithoutUserInput | saved_repositoriesCreateOrConnectWithoutUserInput[]
    createMany?: saved_repositoriesCreateManyUserInputEnvelope
    connect?: saved_repositoriesWhereUniqueInput | saved_repositoriesWhereUniqueInput[]
  }

  export type analysesUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<analysesCreateWithoutUserInput, analysesUncheckedCreateWithoutUserInput> | analysesCreateWithoutUserInput[] | analysesUncheckedCreateWithoutUserInput[]
    connectOrCreate?: analysesCreateOrConnectWithoutUserInput | analysesCreateOrConnectWithoutUserInput[]
    createMany?: analysesCreateManyUserInputEnvelope
    connect?: analysesWhereUniqueInput | analysesWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type profilesUpdatetech_interestsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type saved_repositoriesUpdateManyWithoutUserNestedInput = {
    create?: XOR<saved_repositoriesCreateWithoutUserInput, saved_repositoriesUncheckedCreateWithoutUserInput> | saved_repositoriesCreateWithoutUserInput[] | saved_repositoriesUncheckedCreateWithoutUserInput[]
    connectOrCreate?: saved_repositoriesCreateOrConnectWithoutUserInput | saved_repositoriesCreateOrConnectWithoutUserInput[]
    upsert?: saved_repositoriesUpsertWithWhereUniqueWithoutUserInput | saved_repositoriesUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: saved_repositoriesCreateManyUserInputEnvelope
    set?: saved_repositoriesWhereUniqueInput | saved_repositoriesWhereUniqueInput[]
    disconnect?: saved_repositoriesWhereUniqueInput | saved_repositoriesWhereUniqueInput[]
    delete?: saved_repositoriesWhereUniqueInput | saved_repositoriesWhereUniqueInput[]
    connect?: saved_repositoriesWhereUniqueInput | saved_repositoriesWhereUniqueInput[]
    update?: saved_repositoriesUpdateWithWhereUniqueWithoutUserInput | saved_repositoriesUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: saved_repositoriesUpdateManyWithWhereWithoutUserInput | saved_repositoriesUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: saved_repositoriesScalarWhereInput | saved_repositoriesScalarWhereInput[]
  }

  export type analysesUpdateManyWithoutUserNestedInput = {
    create?: XOR<analysesCreateWithoutUserInput, analysesUncheckedCreateWithoutUserInput> | analysesCreateWithoutUserInput[] | analysesUncheckedCreateWithoutUserInput[]
    connectOrCreate?: analysesCreateOrConnectWithoutUserInput | analysesCreateOrConnectWithoutUserInput[]
    upsert?: analysesUpsertWithWhereUniqueWithoutUserInput | analysesUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: analysesCreateManyUserInputEnvelope
    set?: analysesWhereUniqueInput | analysesWhereUniqueInput[]
    disconnect?: analysesWhereUniqueInput | analysesWhereUniqueInput[]
    delete?: analysesWhereUniqueInput | analysesWhereUniqueInput[]
    connect?: analysesWhereUniqueInput | analysesWhereUniqueInput[]
    update?: analysesUpdateWithWhereUniqueWithoutUserInput | analysesUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: analysesUpdateManyWithWhereWithoutUserInput | analysesUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: analysesScalarWhereInput | analysesScalarWhereInput[]
  }

  export type saved_repositoriesUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<saved_repositoriesCreateWithoutUserInput, saved_repositoriesUncheckedCreateWithoutUserInput> | saved_repositoriesCreateWithoutUserInput[] | saved_repositoriesUncheckedCreateWithoutUserInput[]
    connectOrCreate?: saved_repositoriesCreateOrConnectWithoutUserInput | saved_repositoriesCreateOrConnectWithoutUserInput[]
    upsert?: saved_repositoriesUpsertWithWhereUniqueWithoutUserInput | saved_repositoriesUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: saved_repositoriesCreateManyUserInputEnvelope
    set?: saved_repositoriesWhereUniqueInput | saved_repositoriesWhereUniqueInput[]
    disconnect?: saved_repositoriesWhereUniqueInput | saved_repositoriesWhereUniqueInput[]
    delete?: saved_repositoriesWhereUniqueInput | saved_repositoriesWhereUniqueInput[]
    connect?: saved_repositoriesWhereUniqueInput | saved_repositoriesWhereUniqueInput[]
    update?: saved_repositoriesUpdateWithWhereUniqueWithoutUserInput | saved_repositoriesUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: saved_repositoriesUpdateManyWithWhereWithoutUserInput | saved_repositoriesUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: saved_repositoriesScalarWhereInput | saved_repositoriesScalarWhereInput[]
  }

  export type analysesUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<analysesCreateWithoutUserInput, analysesUncheckedCreateWithoutUserInput> | analysesCreateWithoutUserInput[] | analysesUncheckedCreateWithoutUserInput[]
    connectOrCreate?: analysesCreateOrConnectWithoutUserInput | analysesCreateOrConnectWithoutUserInput[]
    upsert?: analysesUpsertWithWhereUniqueWithoutUserInput | analysesUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: analysesCreateManyUserInputEnvelope
    set?: analysesWhereUniqueInput | analysesWhereUniqueInput[]
    disconnect?: analysesWhereUniqueInput | analysesWhereUniqueInput[]
    delete?: analysesWhereUniqueInput | analysesWhereUniqueInput[]
    connect?: analysesWhereUniqueInput | analysesWhereUniqueInput[]
    update?: analysesUpdateWithWhereUniqueWithoutUserInput | analysesUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: analysesUpdateManyWithWhereWithoutUserInput | analysesUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: analysesScalarWhereInput | analysesScalarWhereInput[]
  }

  export type saved_repositoriesCreateNestedManyWithoutRepositoryInput = {
    create?: XOR<saved_repositoriesCreateWithoutRepositoryInput, saved_repositoriesUncheckedCreateWithoutRepositoryInput> | saved_repositoriesCreateWithoutRepositoryInput[] | saved_repositoriesUncheckedCreateWithoutRepositoryInput[]
    connectOrCreate?: saved_repositoriesCreateOrConnectWithoutRepositoryInput | saved_repositoriesCreateOrConnectWithoutRepositoryInput[]
    createMany?: saved_repositoriesCreateManyRepositoryInputEnvelope
    connect?: saved_repositoriesWhereUniqueInput | saved_repositoriesWhereUniqueInput[]
  }

  export type analysesCreateNestedManyWithoutRepositoryInput = {
    create?: XOR<analysesCreateWithoutRepositoryInput, analysesUncheckedCreateWithoutRepositoryInput> | analysesCreateWithoutRepositoryInput[] | analysesUncheckedCreateWithoutRepositoryInput[]
    connectOrCreate?: analysesCreateOrConnectWithoutRepositoryInput | analysesCreateOrConnectWithoutRepositoryInput[]
    createMany?: analysesCreateManyRepositoryInputEnvelope
    connect?: analysesWhereUniqueInput | analysesWhereUniqueInput[]
  }

  export type saved_repositoriesUncheckedCreateNestedManyWithoutRepositoryInput = {
    create?: XOR<saved_repositoriesCreateWithoutRepositoryInput, saved_repositoriesUncheckedCreateWithoutRepositoryInput> | saved_repositoriesCreateWithoutRepositoryInput[] | saved_repositoriesUncheckedCreateWithoutRepositoryInput[]
    connectOrCreate?: saved_repositoriesCreateOrConnectWithoutRepositoryInput | saved_repositoriesCreateOrConnectWithoutRepositoryInput[]
    createMany?: saved_repositoriesCreateManyRepositoryInputEnvelope
    connect?: saved_repositoriesWhereUniqueInput | saved_repositoriesWhereUniqueInput[]
  }

  export type analysesUncheckedCreateNestedManyWithoutRepositoryInput = {
    create?: XOR<analysesCreateWithoutRepositoryInput, analysesUncheckedCreateWithoutRepositoryInput> | analysesCreateWithoutRepositoryInput[] | analysesUncheckedCreateWithoutRepositoryInput[]
    connectOrCreate?: analysesCreateOrConnectWithoutRepositoryInput | analysesCreateOrConnectWithoutRepositoryInput[]
    createMany?: analysesCreateManyRepositoryInputEnvelope
    connect?: analysesWhereUniqueInput | analysesWhereUniqueInput[]
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type saved_repositoriesUpdateManyWithoutRepositoryNestedInput = {
    create?: XOR<saved_repositoriesCreateWithoutRepositoryInput, saved_repositoriesUncheckedCreateWithoutRepositoryInput> | saved_repositoriesCreateWithoutRepositoryInput[] | saved_repositoriesUncheckedCreateWithoutRepositoryInput[]
    connectOrCreate?: saved_repositoriesCreateOrConnectWithoutRepositoryInput | saved_repositoriesCreateOrConnectWithoutRepositoryInput[]
    upsert?: saved_repositoriesUpsertWithWhereUniqueWithoutRepositoryInput | saved_repositoriesUpsertWithWhereUniqueWithoutRepositoryInput[]
    createMany?: saved_repositoriesCreateManyRepositoryInputEnvelope
    set?: saved_repositoriesWhereUniqueInput | saved_repositoriesWhereUniqueInput[]
    disconnect?: saved_repositoriesWhereUniqueInput | saved_repositoriesWhereUniqueInput[]
    delete?: saved_repositoriesWhereUniqueInput | saved_repositoriesWhereUniqueInput[]
    connect?: saved_repositoriesWhereUniqueInput | saved_repositoriesWhereUniqueInput[]
    update?: saved_repositoriesUpdateWithWhereUniqueWithoutRepositoryInput | saved_repositoriesUpdateWithWhereUniqueWithoutRepositoryInput[]
    updateMany?: saved_repositoriesUpdateManyWithWhereWithoutRepositoryInput | saved_repositoriesUpdateManyWithWhereWithoutRepositoryInput[]
    deleteMany?: saved_repositoriesScalarWhereInput | saved_repositoriesScalarWhereInput[]
  }

  export type analysesUpdateManyWithoutRepositoryNestedInput = {
    create?: XOR<analysesCreateWithoutRepositoryInput, analysesUncheckedCreateWithoutRepositoryInput> | analysesCreateWithoutRepositoryInput[] | analysesUncheckedCreateWithoutRepositoryInput[]
    connectOrCreate?: analysesCreateOrConnectWithoutRepositoryInput | analysesCreateOrConnectWithoutRepositoryInput[]
    upsert?: analysesUpsertWithWhereUniqueWithoutRepositoryInput | analysesUpsertWithWhereUniqueWithoutRepositoryInput[]
    createMany?: analysesCreateManyRepositoryInputEnvelope
    set?: analysesWhereUniqueInput | analysesWhereUniqueInput[]
    disconnect?: analysesWhereUniqueInput | analysesWhereUniqueInput[]
    delete?: analysesWhereUniqueInput | analysesWhereUniqueInput[]
    connect?: analysesWhereUniqueInput | analysesWhereUniqueInput[]
    update?: analysesUpdateWithWhereUniqueWithoutRepositoryInput | analysesUpdateWithWhereUniqueWithoutRepositoryInput[]
    updateMany?: analysesUpdateManyWithWhereWithoutRepositoryInput | analysesUpdateManyWithWhereWithoutRepositoryInput[]
    deleteMany?: analysesScalarWhereInput | analysesScalarWhereInput[]
  }

  export type saved_repositoriesUncheckedUpdateManyWithoutRepositoryNestedInput = {
    create?: XOR<saved_repositoriesCreateWithoutRepositoryInput, saved_repositoriesUncheckedCreateWithoutRepositoryInput> | saved_repositoriesCreateWithoutRepositoryInput[] | saved_repositoriesUncheckedCreateWithoutRepositoryInput[]
    connectOrCreate?: saved_repositoriesCreateOrConnectWithoutRepositoryInput | saved_repositoriesCreateOrConnectWithoutRepositoryInput[]
    upsert?: saved_repositoriesUpsertWithWhereUniqueWithoutRepositoryInput | saved_repositoriesUpsertWithWhereUniqueWithoutRepositoryInput[]
    createMany?: saved_repositoriesCreateManyRepositoryInputEnvelope
    set?: saved_repositoriesWhereUniqueInput | saved_repositoriesWhereUniqueInput[]
    disconnect?: saved_repositoriesWhereUniqueInput | saved_repositoriesWhereUniqueInput[]
    delete?: saved_repositoriesWhereUniqueInput | saved_repositoriesWhereUniqueInput[]
    connect?: saved_repositoriesWhereUniqueInput | saved_repositoriesWhereUniqueInput[]
    update?: saved_repositoriesUpdateWithWhereUniqueWithoutRepositoryInput | saved_repositoriesUpdateWithWhereUniqueWithoutRepositoryInput[]
    updateMany?: saved_repositoriesUpdateManyWithWhereWithoutRepositoryInput | saved_repositoriesUpdateManyWithWhereWithoutRepositoryInput[]
    deleteMany?: saved_repositoriesScalarWhereInput | saved_repositoriesScalarWhereInput[]
  }

  export type analysesUncheckedUpdateManyWithoutRepositoryNestedInput = {
    create?: XOR<analysesCreateWithoutRepositoryInput, analysesUncheckedCreateWithoutRepositoryInput> | analysesCreateWithoutRepositoryInput[] | analysesUncheckedCreateWithoutRepositoryInput[]
    connectOrCreate?: analysesCreateOrConnectWithoutRepositoryInput | analysesCreateOrConnectWithoutRepositoryInput[]
    upsert?: analysesUpsertWithWhereUniqueWithoutRepositoryInput | analysesUpsertWithWhereUniqueWithoutRepositoryInput[]
    createMany?: analysesCreateManyRepositoryInputEnvelope
    set?: analysesWhereUniqueInput | analysesWhereUniqueInput[]
    disconnect?: analysesWhereUniqueInput | analysesWhereUniqueInput[]
    delete?: analysesWhereUniqueInput | analysesWhereUniqueInput[]
    connect?: analysesWhereUniqueInput | analysesWhereUniqueInput[]
    update?: analysesUpdateWithWhereUniqueWithoutRepositoryInput | analysesUpdateWithWhereUniqueWithoutRepositoryInput[]
    updateMany?: analysesUpdateManyWithWhereWithoutRepositoryInput | analysesUpdateManyWithWhereWithoutRepositoryInput[]
    deleteMany?: analysesScalarWhereInput | analysesScalarWhereInput[]
  }

  export type profilesCreateNestedOneWithoutSaved_repositoriesInput = {
    create?: XOR<profilesCreateWithoutSaved_repositoriesInput, profilesUncheckedCreateWithoutSaved_repositoriesInput>
    connectOrCreate?: profilesCreateOrConnectWithoutSaved_repositoriesInput
    connect?: profilesWhereUniqueInput
  }

  export type repositoriesCreateNestedOneWithoutSaved_byInput = {
    create?: XOR<repositoriesCreateWithoutSaved_byInput, repositoriesUncheckedCreateWithoutSaved_byInput>
    connectOrCreate?: repositoriesCreateOrConnectWithoutSaved_byInput
    connect?: repositoriesWhereUniqueInput
  }

  export type profilesUpdateOneRequiredWithoutSaved_repositoriesNestedInput = {
    create?: XOR<profilesCreateWithoutSaved_repositoriesInput, profilesUncheckedCreateWithoutSaved_repositoriesInput>
    connectOrCreate?: profilesCreateOrConnectWithoutSaved_repositoriesInput
    upsert?: profilesUpsertWithoutSaved_repositoriesInput
    connect?: profilesWhereUniqueInput
    update?: XOR<XOR<profilesUpdateToOneWithWhereWithoutSaved_repositoriesInput, profilesUpdateWithoutSaved_repositoriesInput>, profilesUncheckedUpdateWithoutSaved_repositoriesInput>
  }

  export type repositoriesUpdateOneRequiredWithoutSaved_byNestedInput = {
    create?: XOR<repositoriesCreateWithoutSaved_byInput, repositoriesUncheckedCreateWithoutSaved_byInput>
    connectOrCreate?: repositoriesCreateOrConnectWithoutSaved_byInput
    upsert?: repositoriesUpsertWithoutSaved_byInput
    connect?: repositoriesWhereUniqueInput
    update?: XOR<XOR<repositoriesUpdateToOneWithWhereWithoutSaved_byInput, repositoriesUpdateWithoutSaved_byInput>, repositoriesUncheckedUpdateWithoutSaved_byInput>
  }

  export type profilesCreateNestedOneWithoutAnalysesInput = {
    create?: XOR<profilesCreateWithoutAnalysesInput, profilesUncheckedCreateWithoutAnalysesInput>
    connectOrCreate?: profilesCreateOrConnectWithoutAnalysesInput
    connect?: profilesWhereUniqueInput
  }

  export type repositoriesCreateNestedOneWithoutAnalysesInput = {
    create?: XOR<repositoriesCreateWithoutAnalysesInput, repositoriesUncheckedCreateWithoutAnalysesInput>
    connectOrCreate?: repositoriesCreateOrConnectWithoutAnalysesInput
    connect?: repositoriesWhereUniqueInput
  }

  export type profilesUpdateOneRequiredWithoutAnalysesNestedInput = {
    create?: XOR<profilesCreateWithoutAnalysesInput, profilesUncheckedCreateWithoutAnalysesInput>
    connectOrCreate?: profilesCreateOrConnectWithoutAnalysesInput
    upsert?: profilesUpsertWithoutAnalysesInput
    connect?: profilesWhereUniqueInput
    update?: XOR<XOR<profilesUpdateToOneWithWhereWithoutAnalysesInput, profilesUpdateWithoutAnalysesInput>, profilesUncheckedUpdateWithoutAnalysesInput>
  }

  export type repositoriesUpdateOneRequiredWithoutAnalysesNestedInput = {
    create?: XOR<repositoriesCreateWithoutAnalysesInput, repositoriesUncheckedCreateWithoutAnalysesInput>
    connectOrCreate?: repositoriesCreateOrConnectWithoutAnalysesInput
    upsert?: repositoriesUpsertWithoutAnalysesInput
    connect?: repositoriesWhereUniqueInput
    update?: XOR<XOR<repositoriesUpdateToOneWithWhereWithoutAnalysesInput, repositoriesUpdateWithoutAnalysesInput>, repositoriesUncheckedUpdateWithoutAnalysesInput>
  }

  export type Enumapp_roleFieldUpdateOperationsInput = {
    set?: $Enums.app_role
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumapp_roleFilter<$PrismaModel = never> = {
    equals?: $Enums.app_role | Enumapp_roleFieldRefInput<$PrismaModel>
    in?: $Enums.app_role[] | ListEnumapp_roleFieldRefInput<$PrismaModel>
    notIn?: $Enums.app_role[] | ListEnumapp_roleFieldRefInput<$PrismaModel>
    not?: NestedEnumapp_roleFilter<$PrismaModel> | $Enums.app_role
  }

  export type NestedEnumapp_roleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.app_role | Enumapp_roleFieldRefInput<$PrismaModel>
    in?: $Enums.app_role[] | ListEnumapp_roleFieldRefInput<$PrismaModel>
    notIn?: $Enums.app_role[] | ListEnumapp_roleFieldRefInput<$PrismaModel>
    not?: NestedEnumapp_roleWithAggregatesFilter<$PrismaModel> | $Enums.app_role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumapp_roleFilter<$PrismaModel>
    _max?: NestedEnumapp_roleFilter<$PrismaModel>
  }

  export type saved_repositoriesCreateWithoutUserInput = {
    id?: string
    created_at?: Date | string | null
    repository: repositoriesCreateNestedOneWithoutSaved_byInput
  }

  export type saved_repositoriesUncheckedCreateWithoutUserInput = {
    id?: string
    repository_id: bigint | number
    created_at?: Date | string | null
  }

  export type saved_repositoriesCreateOrConnectWithoutUserInput = {
    where: saved_repositoriesWhereUniqueInput
    create: XOR<saved_repositoriesCreateWithoutUserInput, saved_repositoriesUncheckedCreateWithoutUserInput>
  }

  export type saved_repositoriesCreateManyUserInputEnvelope = {
    data: saved_repositoriesCreateManyUserInput | saved_repositoriesCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type analysesCreateWithoutUserInput = {
    id?: string
    mermaid_code: string
    explanation: string
    created_at?: Date | string | null
    repository: repositoriesCreateNestedOneWithoutAnalysesInput
  }

  export type analysesUncheckedCreateWithoutUserInput = {
    id?: string
    repository_id: bigint | number
    mermaid_code: string
    explanation: string
    created_at?: Date | string | null
  }

  export type analysesCreateOrConnectWithoutUserInput = {
    where: analysesWhereUniqueInput
    create: XOR<analysesCreateWithoutUserInput, analysesUncheckedCreateWithoutUserInput>
  }

  export type analysesCreateManyUserInputEnvelope = {
    data: analysesCreateManyUserInput | analysesCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type saved_repositoriesUpsertWithWhereUniqueWithoutUserInput = {
    where: saved_repositoriesWhereUniqueInput
    update: XOR<saved_repositoriesUpdateWithoutUserInput, saved_repositoriesUncheckedUpdateWithoutUserInput>
    create: XOR<saved_repositoriesCreateWithoutUserInput, saved_repositoriesUncheckedCreateWithoutUserInput>
  }

  export type saved_repositoriesUpdateWithWhereUniqueWithoutUserInput = {
    where: saved_repositoriesWhereUniqueInput
    data: XOR<saved_repositoriesUpdateWithoutUserInput, saved_repositoriesUncheckedUpdateWithoutUserInput>
  }

  export type saved_repositoriesUpdateManyWithWhereWithoutUserInput = {
    where: saved_repositoriesScalarWhereInput
    data: XOR<saved_repositoriesUpdateManyMutationInput, saved_repositoriesUncheckedUpdateManyWithoutUserInput>
  }

  export type saved_repositoriesScalarWhereInput = {
    AND?: saved_repositoriesScalarWhereInput | saved_repositoriesScalarWhereInput[]
    OR?: saved_repositoriesScalarWhereInput[]
    NOT?: saved_repositoriesScalarWhereInput | saved_repositoriesScalarWhereInput[]
    id?: StringFilter<"saved_repositories"> | string
    user_id?: StringFilter<"saved_repositories"> | string
    repository_id?: BigIntFilter<"saved_repositories"> | bigint | number
    created_at?: DateTimeNullableFilter<"saved_repositories"> | Date | string | null
  }

  export type analysesUpsertWithWhereUniqueWithoutUserInput = {
    where: analysesWhereUniqueInput
    update: XOR<analysesUpdateWithoutUserInput, analysesUncheckedUpdateWithoutUserInput>
    create: XOR<analysesCreateWithoutUserInput, analysesUncheckedCreateWithoutUserInput>
  }

  export type analysesUpdateWithWhereUniqueWithoutUserInput = {
    where: analysesWhereUniqueInput
    data: XOR<analysesUpdateWithoutUserInput, analysesUncheckedUpdateWithoutUserInput>
  }

  export type analysesUpdateManyWithWhereWithoutUserInput = {
    where: analysesScalarWhereInput
    data: XOR<analysesUpdateManyMutationInput, analysesUncheckedUpdateManyWithoutUserInput>
  }

  export type analysesScalarWhereInput = {
    AND?: analysesScalarWhereInput | analysesScalarWhereInput[]
    OR?: analysesScalarWhereInput[]
    NOT?: analysesScalarWhereInput | analysesScalarWhereInput[]
    id?: StringFilter<"analyses"> | string
    user_id?: StringFilter<"analyses"> | string
    repository_id?: BigIntFilter<"analyses"> | bigint | number
    mermaid_code?: StringFilter<"analyses"> | string
    explanation?: StringFilter<"analyses"> | string
    created_at?: DateTimeNullableFilter<"analyses"> | Date | string | null
  }

  export type saved_repositoriesCreateWithoutRepositoryInput = {
    id?: string
    created_at?: Date | string | null
    user: profilesCreateNestedOneWithoutSaved_repositoriesInput
  }

  export type saved_repositoriesUncheckedCreateWithoutRepositoryInput = {
    id?: string
    user_id: string
    created_at?: Date | string | null
  }

  export type saved_repositoriesCreateOrConnectWithoutRepositoryInput = {
    where: saved_repositoriesWhereUniqueInput
    create: XOR<saved_repositoriesCreateWithoutRepositoryInput, saved_repositoriesUncheckedCreateWithoutRepositoryInput>
  }

  export type saved_repositoriesCreateManyRepositoryInputEnvelope = {
    data: saved_repositoriesCreateManyRepositoryInput | saved_repositoriesCreateManyRepositoryInput[]
    skipDuplicates?: boolean
  }

  export type analysesCreateWithoutRepositoryInput = {
    id?: string
    mermaid_code: string
    explanation: string
    created_at?: Date | string | null
    user: profilesCreateNestedOneWithoutAnalysesInput
  }

  export type analysesUncheckedCreateWithoutRepositoryInput = {
    id?: string
    user_id: string
    mermaid_code: string
    explanation: string
    created_at?: Date | string | null
  }

  export type analysesCreateOrConnectWithoutRepositoryInput = {
    where: analysesWhereUniqueInput
    create: XOR<analysesCreateWithoutRepositoryInput, analysesUncheckedCreateWithoutRepositoryInput>
  }

  export type analysesCreateManyRepositoryInputEnvelope = {
    data: analysesCreateManyRepositoryInput | analysesCreateManyRepositoryInput[]
    skipDuplicates?: boolean
  }

  export type saved_repositoriesUpsertWithWhereUniqueWithoutRepositoryInput = {
    where: saved_repositoriesWhereUniqueInput
    update: XOR<saved_repositoriesUpdateWithoutRepositoryInput, saved_repositoriesUncheckedUpdateWithoutRepositoryInput>
    create: XOR<saved_repositoriesCreateWithoutRepositoryInput, saved_repositoriesUncheckedCreateWithoutRepositoryInput>
  }

  export type saved_repositoriesUpdateWithWhereUniqueWithoutRepositoryInput = {
    where: saved_repositoriesWhereUniqueInput
    data: XOR<saved_repositoriesUpdateWithoutRepositoryInput, saved_repositoriesUncheckedUpdateWithoutRepositoryInput>
  }

  export type saved_repositoriesUpdateManyWithWhereWithoutRepositoryInput = {
    where: saved_repositoriesScalarWhereInput
    data: XOR<saved_repositoriesUpdateManyMutationInput, saved_repositoriesUncheckedUpdateManyWithoutRepositoryInput>
  }

  export type analysesUpsertWithWhereUniqueWithoutRepositoryInput = {
    where: analysesWhereUniqueInput
    update: XOR<analysesUpdateWithoutRepositoryInput, analysesUncheckedUpdateWithoutRepositoryInput>
    create: XOR<analysesCreateWithoutRepositoryInput, analysesUncheckedCreateWithoutRepositoryInput>
  }

  export type analysesUpdateWithWhereUniqueWithoutRepositoryInput = {
    where: analysesWhereUniqueInput
    data: XOR<analysesUpdateWithoutRepositoryInput, analysesUncheckedUpdateWithoutRepositoryInput>
  }

  export type analysesUpdateManyWithWhereWithoutRepositoryInput = {
    where: analysesScalarWhereInput
    data: XOR<analysesUpdateManyMutationInput, analysesUncheckedUpdateManyWithoutRepositoryInput>
  }

  export type profilesCreateWithoutSaved_repositoriesInput = {
    id?: string
    email?: string | null
    full_name?: string | null
    avatar_url?: string | null
    bio?: string | null
    github_username?: string | null
    experience_level?: string | null
    tech_interests?: profilesCreatetech_interestsInput | string[]
    created_at?: Date | string | null
    updated_at?: Date | string | null
    analyses?: analysesCreateNestedManyWithoutUserInput
  }

  export type profilesUncheckedCreateWithoutSaved_repositoriesInput = {
    id?: string
    email?: string | null
    full_name?: string | null
    avatar_url?: string | null
    bio?: string | null
    github_username?: string | null
    experience_level?: string | null
    tech_interests?: profilesCreatetech_interestsInput | string[]
    created_at?: Date | string | null
    updated_at?: Date | string | null
    analyses?: analysesUncheckedCreateNestedManyWithoutUserInput
  }

  export type profilesCreateOrConnectWithoutSaved_repositoriesInput = {
    where: profilesWhereUniqueInput
    create: XOR<profilesCreateWithoutSaved_repositoriesInput, profilesUncheckedCreateWithoutSaved_repositoriesInput>
  }

  export type repositoriesCreateWithoutSaved_byInput = {
    id: bigint | number
    full_name: string
    data: JsonNullValueInput | InputJsonValue
    last_analyzed?: Date | string | null
    created_at?: Date | string | null
    analyses?: analysesCreateNestedManyWithoutRepositoryInput
  }

  export type repositoriesUncheckedCreateWithoutSaved_byInput = {
    id: bigint | number
    full_name: string
    data: JsonNullValueInput | InputJsonValue
    last_analyzed?: Date | string | null
    created_at?: Date | string | null
    analyses?: analysesUncheckedCreateNestedManyWithoutRepositoryInput
  }

  export type repositoriesCreateOrConnectWithoutSaved_byInput = {
    where: repositoriesWhereUniqueInput
    create: XOR<repositoriesCreateWithoutSaved_byInput, repositoriesUncheckedCreateWithoutSaved_byInput>
  }

  export type profilesUpsertWithoutSaved_repositoriesInput = {
    update: XOR<profilesUpdateWithoutSaved_repositoriesInput, profilesUncheckedUpdateWithoutSaved_repositoriesInput>
    create: XOR<profilesCreateWithoutSaved_repositoriesInput, profilesUncheckedCreateWithoutSaved_repositoriesInput>
    where?: profilesWhereInput
  }

  export type profilesUpdateToOneWithWhereWithoutSaved_repositoriesInput = {
    where?: profilesWhereInput
    data: XOR<profilesUpdateWithoutSaved_repositoriesInput, profilesUncheckedUpdateWithoutSaved_repositoriesInput>
  }

  export type profilesUpdateWithoutSaved_repositoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    github_username?: NullableStringFieldUpdateOperationsInput | string | null
    experience_level?: NullableStringFieldUpdateOperationsInput | string | null
    tech_interests?: profilesUpdatetech_interestsInput | string[]
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    analyses?: analysesUpdateManyWithoutUserNestedInput
  }

  export type profilesUncheckedUpdateWithoutSaved_repositoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    github_username?: NullableStringFieldUpdateOperationsInput | string | null
    experience_level?: NullableStringFieldUpdateOperationsInput | string | null
    tech_interests?: profilesUpdatetech_interestsInput | string[]
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    analyses?: analysesUncheckedUpdateManyWithoutUserNestedInput
  }

  export type repositoriesUpsertWithoutSaved_byInput = {
    update: XOR<repositoriesUpdateWithoutSaved_byInput, repositoriesUncheckedUpdateWithoutSaved_byInput>
    create: XOR<repositoriesCreateWithoutSaved_byInput, repositoriesUncheckedCreateWithoutSaved_byInput>
    where?: repositoriesWhereInput
  }

  export type repositoriesUpdateToOneWithWhereWithoutSaved_byInput = {
    where?: repositoriesWhereInput
    data: XOR<repositoriesUpdateWithoutSaved_byInput, repositoriesUncheckedUpdateWithoutSaved_byInput>
  }

  export type repositoriesUpdateWithoutSaved_byInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    full_name?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    last_analyzed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    analyses?: analysesUpdateManyWithoutRepositoryNestedInput
  }

  export type repositoriesUncheckedUpdateWithoutSaved_byInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    full_name?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    last_analyzed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    analyses?: analysesUncheckedUpdateManyWithoutRepositoryNestedInput
  }

  export type profilesCreateWithoutAnalysesInput = {
    id?: string
    email?: string | null
    full_name?: string | null
    avatar_url?: string | null
    bio?: string | null
    github_username?: string | null
    experience_level?: string | null
    tech_interests?: profilesCreatetech_interestsInput | string[]
    created_at?: Date | string | null
    updated_at?: Date | string | null
    saved_repositories?: saved_repositoriesCreateNestedManyWithoutUserInput
  }

  export type profilesUncheckedCreateWithoutAnalysesInput = {
    id?: string
    email?: string | null
    full_name?: string | null
    avatar_url?: string | null
    bio?: string | null
    github_username?: string | null
    experience_level?: string | null
    tech_interests?: profilesCreatetech_interestsInput | string[]
    created_at?: Date | string | null
    updated_at?: Date | string | null
    saved_repositories?: saved_repositoriesUncheckedCreateNestedManyWithoutUserInput
  }

  export type profilesCreateOrConnectWithoutAnalysesInput = {
    where: profilesWhereUniqueInput
    create: XOR<profilesCreateWithoutAnalysesInput, profilesUncheckedCreateWithoutAnalysesInput>
  }

  export type repositoriesCreateWithoutAnalysesInput = {
    id: bigint | number
    full_name: string
    data: JsonNullValueInput | InputJsonValue
    last_analyzed?: Date | string | null
    created_at?: Date | string | null
    saved_by?: saved_repositoriesCreateNestedManyWithoutRepositoryInput
  }

  export type repositoriesUncheckedCreateWithoutAnalysesInput = {
    id: bigint | number
    full_name: string
    data: JsonNullValueInput | InputJsonValue
    last_analyzed?: Date | string | null
    created_at?: Date | string | null
    saved_by?: saved_repositoriesUncheckedCreateNestedManyWithoutRepositoryInput
  }

  export type repositoriesCreateOrConnectWithoutAnalysesInput = {
    where: repositoriesWhereUniqueInput
    create: XOR<repositoriesCreateWithoutAnalysesInput, repositoriesUncheckedCreateWithoutAnalysesInput>
  }

  export type profilesUpsertWithoutAnalysesInput = {
    update: XOR<profilesUpdateWithoutAnalysesInput, profilesUncheckedUpdateWithoutAnalysesInput>
    create: XOR<profilesCreateWithoutAnalysesInput, profilesUncheckedCreateWithoutAnalysesInput>
    where?: profilesWhereInput
  }

  export type profilesUpdateToOneWithWhereWithoutAnalysesInput = {
    where?: profilesWhereInput
    data: XOR<profilesUpdateWithoutAnalysesInput, profilesUncheckedUpdateWithoutAnalysesInput>
  }

  export type profilesUpdateWithoutAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    github_username?: NullableStringFieldUpdateOperationsInput | string | null
    experience_level?: NullableStringFieldUpdateOperationsInput | string | null
    tech_interests?: profilesUpdatetech_interestsInput | string[]
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    saved_repositories?: saved_repositoriesUpdateManyWithoutUserNestedInput
  }

  export type profilesUncheckedUpdateWithoutAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    github_username?: NullableStringFieldUpdateOperationsInput | string | null
    experience_level?: NullableStringFieldUpdateOperationsInput | string | null
    tech_interests?: profilesUpdatetech_interestsInput | string[]
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    saved_repositories?: saved_repositoriesUncheckedUpdateManyWithoutUserNestedInput
  }

  export type repositoriesUpsertWithoutAnalysesInput = {
    update: XOR<repositoriesUpdateWithoutAnalysesInput, repositoriesUncheckedUpdateWithoutAnalysesInput>
    create: XOR<repositoriesCreateWithoutAnalysesInput, repositoriesUncheckedCreateWithoutAnalysesInput>
    where?: repositoriesWhereInput
  }

  export type repositoriesUpdateToOneWithWhereWithoutAnalysesInput = {
    where?: repositoriesWhereInput
    data: XOR<repositoriesUpdateWithoutAnalysesInput, repositoriesUncheckedUpdateWithoutAnalysesInput>
  }

  export type repositoriesUpdateWithoutAnalysesInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    full_name?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    last_analyzed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    saved_by?: saved_repositoriesUpdateManyWithoutRepositoryNestedInput
  }

  export type repositoriesUncheckedUpdateWithoutAnalysesInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    full_name?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    last_analyzed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    saved_by?: saved_repositoriesUncheckedUpdateManyWithoutRepositoryNestedInput
  }

  export type saved_repositoriesCreateManyUserInput = {
    id?: string
    repository_id: bigint | number
    created_at?: Date | string | null
  }

  export type analysesCreateManyUserInput = {
    id?: string
    repository_id: bigint | number
    mermaid_code: string
    explanation: string
    created_at?: Date | string | null
  }

  export type saved_repositoriesUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    repository?: repositoriesUpdateOneRequiredWithoutSaved_byNestedInput
  }

  export type saved_repositoriesUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    repository_id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type saved_repositoriesUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    repository_id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type analysesUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    mermaid_code?: StringFieldUpdateOperationsInput | string
    explanation?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    repository?: repositoriesUpdateOneRequiredWithoutAnalysesNestedInput
  }

  export type analysesUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    repository_id?: BigIntFieldUpdateOperationsInput | bigint | number
    mermaid_code?: StringFieldUpdateOperationsInput | string
    explanation?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type analysesUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    repository_id?: BigIntFieldUpdateOperationsInput | bigint | number
    mermaid_code?: StringFieldUpdateOperationsInput | string
    explanation?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type saved_repositoriesCreateManyRepositoryInput = {
    id?: string
    user_id: string
    created_at?: Date | string | null
  }

  export type analysesCreateManyRepositoryInput = {
    id?: string
    user_id: string
    mermaid_code: string
    explanation: string
    created_at?: Date | string | null
  }

  export type saved_repositoriesUpdateWithoutRepositoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: profilesUpdateOneRequiredWithoutSaved_repositoriesNestedInput
  }

  export type saved_repositoriesUncheckedUpdateWithoutRepositoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type saved_repositoriesUncheckedUpdateManyWithoutRepositoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type analysesUpdateWithoutRepositoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    mermaid_code?: StringFieldUpdateOperationsInput | string
    explanation?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: profilesUpdateOneRequiredWithoutAnalysesNestedInput
  }

  export type analysesUncheckedUpdateWithoutRepositoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    mermaid_code?: StringFieldUpdateOperationsInput | string
    explanation?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type analysesUncheckedUpdateManyWithoutRepositoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    mermaid_code?: StringFieldUpdateOperationsInput | string
    explanation?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use ProfilesCountOutputTypeDefaultArgs instead
     */
    export type ProfilesCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProfilesCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RepositoriesCountOutputTypeDefaultArgs instead
     */
    export type RepositoriesCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RepositoriesCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use profilesDefaultArgs instead
     */
    export type profilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = profilesDefaultArgs<ExtArgs>
    /**
     * @deprecated Use repositoriesDefaultArgs instead
     */
    export type repositoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = repositoriesDefaultArgs<ExtArgs>
    /**
     * @deprecated Use saved_repositoriesDefaultArgs instead
     */
    export type saved_repositoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = saved_repositoriesDefaultArgs<ExtArgs>
    /**
     * @deprecated Use analysesDefaultArgs instead
     */
    export type analysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = analysesDefaultArgs<ExtArgs>
    /**
     * @deprecated Use user_rolesDefaultArgs instead
     */
    export type user_rolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = user_rolesDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}