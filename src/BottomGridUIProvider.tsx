import {
  StagePanelLocation,
  StagePanelSection,
  StageUsage,
  UiItemsProvider,
  Widget,
} from "@itwin/appui-react";

import { Table, TableProps } from "./TableGrid";
import { IModelApp, IModelConnection } from "@itwin/core-frontend";
import { UnifiedSelectionContextProvider } from "@itwin/presentation-components";
import React, { useEffect } from "react";

function RulesTable() {
  const [iModel, setIModel] = React.useState<IModelConnection | undefined>(
    undefined
  );

  useEffect(() => {
    setIModel(IModelApp.viewManager.selectedView?.iModel);
  }, [iModel]);

  if (!iModel) {
    return (
      <div>
        <span>No iModel selected</span>
      </div>
    );
  }
  return (
    <UnifiedSelectionContextProvider imodel={iModel}>
      <Table width={400} height={400} iModel={iModel} />
    </UnifiedSelectionContextProvider>
  );
}

export class BottomGridUIProvider implements UiItemsProvider {
  public readonly id = "BottomGridUIProvider";

  public provideWidgets(
    _stageId: string,
    stageUsage: string,
    location: StagePanelLocation,
    section?: StagePanelSection
  ): ReadonlyArray<Widget> {
    const widgets: Widget[] = [];
    if (
      stageUsage === StageUsage.General &&
      location === StagePanelLocation.Bottom &&
      section === StagePanelSection.Start
    ) {
      const bottomGrid: Widget = {
        id: "BottomGrid",
        label: "BottomGrid",
        content: <RulesTable />,
      };
      widgets.push(bottomGrid);
    }

    return widgets;
  }
}
