import {
  StagePanelLocation,
  StagePanelSection,
  StageUsage,
  UiItemsProvider,
  Widget,
} from "@itwin/appui-react";
import { CategoryComponent } from "./CategoryComponent";

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
      const secondWidget: Widget = {
        id: "SecondWidget",
        label: "SecondWidget",
        content: <span>"SecondWidgetPlaceholder"</span>,
      };
      widgets.push(secondWidget);
    }
    {
      const firstWidget: Widget = {
        id: "FirstWidget",
        label: "Category",
        content: <CategoryComponent />,
      };
      widgets.push(firstWidget);
    }

    return widgets;
  }
}
