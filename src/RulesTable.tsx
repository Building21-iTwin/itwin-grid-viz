import { IModelApp, IModelConnection } from "@itwin/core-frontend";
import { Table } from "./TableGrid";
import { UnifiedSelectionContextProvider } from "@itwin/presentation-components";
import React, { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ViewHelper } from "@itwin/measure-tools-react";
import { ColorPickerButton } from "@itwin/imodel-components-react";
import { ColorDef } from "@itwin/core-common";

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
  const [colorValueState, SetColorValueState] = React.useState<ColorDef>(
    ColorDef.red
  );

  const _onColorPick = (colorValue: ColorDef) => {
    SetColorValueState(colorValue);
  };
  return (
    <ErrorBoundary FallbackComponent={ResetPage}>
      <UnifiedSelectionContextProvider imodel={iModel}>
        <Table width={400} height={400} iModel={iModel} />
      </UnifiedSelectionContextProvider>
    </ErrorBoundary>
  );
}
function ResetPage(props: { error: Error; resetErrorBoundary: () => void }) {
  return <button onClick={props.resetErrorBoundary}> Refresh</button>;
}
export default RulesTable;
