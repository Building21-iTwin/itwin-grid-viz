import { IModelApp, IModelConnection } from "@itwin/core-frontend";
import { Table } from "./TableGrid";
import { UnifiedSelectionContextProvider } from "@itwin/presentation-components";
import React, { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";

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
