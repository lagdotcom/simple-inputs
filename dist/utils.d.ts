declare type FilterFlags<Base, Condition> = {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};
declare type AllowedNames<Base, Condition> = FilterFlags<Base, Condition>[keyof Base];
export declare type SubType<Base, Condition> = Pick<Base, AllowedNames<Base, Condition>>;
export {};
