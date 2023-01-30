declare interface IHelloWorldWebPartStrings {
  LastQuarter: string,
  NextQuarter: string,
  MenubarTable: string,
  MenubarForm: string,
  FormName: string,
  FormStartDate: string,
  FormEndDate: string
}

declare module 'HelloWorldWebPartStrings' {
  const strings: IHelloWorldWebPartStrings;
  export = strings;
}
