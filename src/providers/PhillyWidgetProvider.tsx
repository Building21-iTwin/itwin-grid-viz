/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Widget, StagePanelSection, StagePanelLocation, UiItemsProvider } from "@itwin/appui-react";
import { RealityDataWidget } from "./RealityDataWidget";
import "./RealityDataWidget.css";

export class PhillyWidgetProvider implements UiItemsProvider {
  public readonly id = "PhillyWidget";

  public provideWidgets(
    stageId: string,
    _stageUsage: string,
    location: StagePanelLocation,
    _section?: StagePanelSection | undefined
  ): ReadonlyArray<Widget> {
    const widgets: Widget[] = [];

    widgets.push({
      id: "phillyWidget",
      label: "Reality Data",
      content: <RealityDataWidget />
    });
    return widgets;
  }
}