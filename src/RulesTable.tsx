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
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <UnifiedSelectionContextProvider imodel={iModel}>
        <Table width={400} height={400} iModel={iModel} />
      </UnifiedSelectionContextProvider>
    </ErrorBoundary>
  );
}

export default RulesTable;
