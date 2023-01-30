declare interface IHelloWorldWebPartStrings {
  LastQuarter: string
  NextQuarter: string
}

declare module 'HelloWorldWebPartStrings' {
  const strings: IHelloWorldWebPartStrings;
  export = strings;
}
