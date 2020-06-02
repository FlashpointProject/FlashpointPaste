
/** A log entry _before_ it is added to the main log */
export type ILogPreEntry = {
  /** Name of the source of the log entry (name of what added the log entry) */
  source: string;
  /** Content of the log entry */
  content: string;
}

/** A log entry from the main log */
export type ILogEntry = ILogPreEntry & {
  /** Timestamp of when the entry was added to the main's log */
  timestamp: number;
}

/** Obtain the return type of a function */
export type ReturnTypeOf<T extends AnyFunction> = T extends (...args: ArgumentTypesOf<T>) => infer R ? R : any;

/** Obtain the argument types of a function */
export type ArgumentTypesOf<F extends AnyFunction> = F extends (...args: infer A) => any ? A : never;

/** Any function. */
export type AnyFunction = (...args: any[]) => any;