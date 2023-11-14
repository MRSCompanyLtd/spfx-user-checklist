# user-checklist

## Summary

SPFx checklist web part for SharePoint Online. Connects to two lists: one that provides a list of items/tasks and another that tracks user progress. Supports semantic colours providing support regardless of theme and section background colour.

![user checklist screenshot](/sharepoint/assets/checklist.png)

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.17.4-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites

- Create two lists on your site to connect to:
  - Source list -> A list of tasks/items to complete:
    - Title: The field that will show in the checklist.
    - Content: Rich text field (multi-line text) which will show when the item is expanded.
  - Tracking list -> A list to track user progress:
    - Task: Lookup field to the source list.
    - Employee: Person field to track the user who completed the task.
    - Complete: Boolean (Yes/No) field.
    - Completed: Date and time field.

## Solution

| Solution    | Author(s)                                               |
| ----------- | ------------------------------------------------------- |
| spfx-user-checklist | [MRS Company Ltd](https://mrscompany.com) |

## Version history

| Version | Date             | Comments        |
| ------- | ---------------- | --------------- |
| 1.0     | November 14, 2023 | Initial release |

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

1. Clone repository:

```bash
git clone https://github.com/mrscompanyltd/spfx-user-checklist
```

2. Change into directory:
```bash
cd spfx-user-checklist
```

3. Install dependencies:
```bash
npm i
```

4. Run solution:
```bash
gulp serve --nobrowser
```

5. Navigate to your workbench in your browser: https://{yourTenant}.sharepoint.com/sites/{yourSite}/_layouts/workbench.aspx

To build:
```bash
gulp build && gulp bundle --ship && gulp package-solution --ship
```

6. Upload sppkg file from /sharepoint/solution into your app catalog in SharePoint.

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development
