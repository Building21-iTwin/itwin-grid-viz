import {
  StagePanelLocation,
  StagePanelSection,
  StageUsage,
  UiItemsProvider,
  Widget,
} from "@itwin/appui-react";

export class LeftPanelUIProvider implements UiItemsProvider {
  public readonly id = "LeftPanelUIProvider";

  public provideWidgets(
    _stageId: string,
    stageUsage: string,
    location: StagePanelLocation,
    section?: StagePanelSection
  ): ReadonlyArray<Widget> {
    const widgets: Widget[] = [];
    if (
      stageUsage === StageUsage.General &&
      location === StagePanelLocation.Left &&
      section === StagePanelSection.Start
    ) {
      const firstWidget: Widget = {
        id: "FirstWidget",
        label: "FirstWidget",
        content: <span>"FirstWidgetPlaceholder"</span>,
      };
      widgets.push(firstWidget);
    }
    {
      const secondWidget: Widget = {
        id: "SecondWidget",
        label: "SecondtWidget",
        content: <span>"SecondWidgetPlaceholder"</span>,
      };
      widgets.push(secondWidget);
    }

    return widgets;
  }
}
