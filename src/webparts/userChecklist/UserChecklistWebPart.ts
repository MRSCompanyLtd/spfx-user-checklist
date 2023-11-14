import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import * as strings from 'UserChecklistWebPartStrings';
import UserChecklist from './components/UserChecklist';
import { IUserChecklistProps } from './components/IUserChecklistProps';
import { IDropdownOption } from 'office-ui-fabric-react';

export interface IUserChecklistWebPartProps {
  title: string;
  description: string;
  checklist: string;
  progress: string;
  listOptions: IDropdownOption[];
}

export default class UserChecklistWebPart extends BaseClientSideWebPart<IUserChecklistWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  private _listOptions: IDropdownOption[] = [];
  private _userId: number = 0;

  public render(): void {
    const element: React.ReactElement<IUserChecklistProps> = React.createElement(
      UserChecklist,
      {
        description: this.properties.description,
        title: this.properties.title,
        checklist: this.properties.checklist,
        progress: this.properties.progress,
        userId: this._userId,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async loadLists(): Promise<IDropdownOption[]> {
    try {
      const url: string = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists?$filter=Hidden eq false`;
      const res: SPHttpClientResponse = await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
      const lists: IDropdownOption[] = await res.json()
        .then(j => j.value.map((v: { Id: string, Title: string }) => {
          return {
            key: v.Id,
            text: v.Title
          }
        }));
      
      return lists;
    }
    catch (e) {
      console.error(e);

      return [];
    }
  }

  protected async loadUserId(): Promise<number> {
    try {
      const url: string = `${this.context.pageContext.web.absoluteUrl}/_api/web/currentuser?$select=Id`;
      const res: SPHttpClientResponse = await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
      const data: { Id: number } = await res.json();

      return data.Id;
    } catch (e) {
      console.error(e);

      return 0;
    }
  }

  protected async onInit(): Promise<void> {
    console.log('Is dark theme: ', this._isDarkTheme);
    console.log('Environment message: ', this._environmentMessage);

    this._listOptions = await this.loadLists();
    this._userId = await this.loadUserId();

    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              throw new Error('Unknown host');
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      const semanticColorKeys: string[] = Object.keys(semanticColors);

      semanticColorKeys.forEach((value: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const val = (semanticColors as any)[value];

        this.domElement.style.setProperty(`--${value}`, val || null);
      });
    }

  }

  protected async onPropertyPaneFieldChanged(propertyPath: string, oldValue: string, newValue: string): Promise<void> {
    // If the property is either checklist or progress, ensure that the other property is not the same
    if (propertyPath === 'checklist' || propertyPath === 'progress') {
      if (this.properties.checklist === this.properties.progress) {
        this.properties.progress = this.properties.checklist === newValue ? oldValue : this.properties.progress;
      }
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupName: strings.SettingsGroupName,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel,
                  placeholder: `Enter ${strings.TitleFieldLabel}...`
                }),
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel,
                  placeholder: `Enter ${strings.DescriptionFieldLabel}...`
                })
              ]
            },
            {
              groupName: strings.SourceGroupName,
              groupFields: [
                PropertyPaneDropdown('checklist', {
                  label: strings.SourceFieldLabel,
                  selectedKey: this.properties.checklist,
                  options: this._listOptions.reduce((wv: IDropdownOption[], cv: IDropdownOption) => {
                    if (cv.key !== this.properties.progress) {
                      wv.push(cv);
                    }

                    return wv;
                  }, [])
                })
              ]
            },
            {
              groupName: strings.TargetGroupName,
              groupFields: [
                PropertyPaneDropdown('progress', {
                  label: strings.TargetFieldLabel,
                  selectedKey: this.properties.progress,
                  options: this._listOptions.reduce((wv: IDropdownOption[], cv: IDropdownOption) => {
                    if (cv.key !== this.properties.checklist) {
                      wv.push(cv);
                    }

                    return wv;
                  }, [])
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
