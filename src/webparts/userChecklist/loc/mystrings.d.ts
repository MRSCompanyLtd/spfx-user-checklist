declare interface IUserChecklistWebPartStrings {
  SettingsGroupName: string;
  TitleFieldLabel: string;
  DescriptionFieldLabel: string;
  SourceGroupName: string;
  SourceFieldLabel: string;
  TargetGroupName: string;
  TargetFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppLocalEnvironmentOffice: string;
  AppLocalEnvironmentOutlook: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  AppOfficeEnvironment: string;
  AppOutlookEnvironment: string;
}

declare module 'UserChecklistWebPartStrings' {
  const strings: IUserChecklistWebPartStrings;
  export = strings;
}
