import {
  StagePanelLocation,
  StagePanelSection,
  StageUsage,
  UiItemsProvider,
  Widget,
} from "@itwin/appui-react";
import SearchBox, { CategoryComponent } from "./CategoryComponent";



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
      const categories: Widget = {
        id: "Categories",
        label: "Categories",
        content:<CategoryComponent />,
        
      };
    
      
      widgets.push(categories);
    }
    
    <SearchBox inputProps={{ placeholder: 'SearchBox component' }} />

    return widgets;
  }
};

