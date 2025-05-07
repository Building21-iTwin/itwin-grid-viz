/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./App.scss";

import type { ScreenViewport } from "@itwin/core-frontend";
import {
  EmphasizeElements,
  FitViewTool,
  IModelApp,
  StandardViewId,
} from "@itwin/core-frontend";
import { FillCentered } from "@itwin/core-react";
import { ProgressLinear } from "@itwin/itwinui-react";
import {
  MeasurementActionToolbar,
  MeasureTools,
  MeasureToolsUiItemsProvider,
} from "@itwin/measure-tools-react";
import {
  AncestorsNavigationControls,
  CopyPropertyTextContextMenuItem,
  PropertyGridManager,
  PropertyGridUiItemsProvider,
  ShowHideNullValuesSettingsMenuItem,
} from "@itwin/property-grid-react";
import {
  TreeWidget,
  TreeWidgetUiItemsProvider,
} from "@itwin/tree-widget-react";
import {
  useAccessToken,
  Viewer,
  ViewerContentToolsProvider,
  ViewerNavigationToolsProvider,
  ViewerPerformance,
  ViewerStatusbarItemsProvider,
} from "@itwin/web-viewer-react";
import React, {
  useContext,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Auth } from "./Auth";
import { history } from "./history";
import { LeftPanelUIProvider } from "./components/LeftPanelUIProvider";
import { BottomGridUIProvider } from "./components/BottomGridUIProvider";
import { IModel, QueryBinder, QueryRowFormat } from "@itwin/core-common";
import { Presentation } from "@itwin/presentation-frontend";
import { mapLayerOptions, tileAdminOptions } from "./maps/MapLayerOptions";

export interface CategoryModelContextType {
  selectedModelIds: string[];
  setSelectedModelIds: (ids: string[]) => void;
  selectedCategoryIds: string[];
  setSelectedCategoryIds: (ids: string[]) => void;
  querySelectionContext: string;
}

export const CategoryModelContext = createContext<CategoryModelContextType>({
  selectedModelIds: [],
  setSelectedModelIds: () => {},
  selectedCategoryIds: [],
  setSelectedCategoryIds: () => {},
  querySelectionContext: "",
});

const App: React.FC = () => {
  const [iModelId, setIModelId] = useState(process.env.IMJS_IMODEL_ID);
  const [iTwinId, setITwinId] = useState(process.env.IMJS_ITWIN_ID);
  const [changesetId, setChangesetId] = useState(
    process.env.IMJS_AUTH_CLIENT_CHANGESET_ID
  );

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([]);
  const querySelectionContext =
    "SELECT ec_classname(ECClassId, 's:c') as [classname], ECInstanceId as [id] FROM bis.GeometricElement3d WHERE ";

  const accessToken = useAccessToken();

  const authClient = Auth.getClient();

  const login = useCallback(async () => {
    try {
      await authClient.signInSilent();
    } catch {
      await authClient.signIn();
    }
  }, [authClient]);

  useEffect(() => {
    void login();
  }, [login]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("iTwinId")) {
      setITwinId(urlParams.get("iTwinId") as string);
    }
    if (urlParams.has("iModelId")) {
      setIModelId(urlParams.get("iModelId") as string);
    }
    if (urlParams.has("changesetId")) {
      setChangesetId(urlParams.get("changesetId") as string);
    }
  }, []);

  useEffect(() => {
    let url = `viewer?iTwinId=${iTwinId}`;

    if (iModelId) {
      url = `${url}&iModelId=${iModelId}`;
    }

    if (changesetId) {
      url = `${url}&changesetId=${changesetId}`;
    }
    history.push(url);
  }, [iTwinId, iModelId, changesetId]);

  /** NOTE: This function will execute the "Fit View" tool after the iModel is loaded into the Viewer.
   * This will provide an "optimal" view of the model. However, it will override any default views that are
   * stored in the iModel. Delete this function and the prop that it is passed to if you prefer
   * to honor default views when they are present instead (the Viewer will still apply a similar function to iModels that do not have a default view).
   */
  const viewConfiguration = useCallback((viewPort: ScreenViewport) => {
    // default execute the fitview tool and use the iso standard view after tile trees are loaded
    const tileTreesLoaded = () => {
      return new Promise((resolve, reject) => {
        const start = new Date();
        const intvl = setInterval(() => {
          if (viewPort.areAllTileTreesLoaded) {
            ViewerPerformance.addMark("TilesLoaded");
            ViewerPerformance.addMeasure(
              "TileTreesLoaded",
              "ViewerStarting",
              "TilesLoaded"
            );
            clearInterval(intvl);
            resolve(true);
          }
          const now = new Date();
          // after 20 seconds, stop waiting and fit the view
          if (now.getTime() - start.getTime() > 20000) {
            reject();
          }
        }, 100);
      });
    };

    tileTreesLoaded().finally(() => {
      void IModelApp.tools.run(FitViewTool.toolId, viewPort, true, false);
      viewPort.view.setStandardRotation(StandardViewId.Iso);
      viewPort.changeBackgroundMapProps({
        applyTerrain: true,
      });
    });
  }, []);

  // Maybe up there after finally, add the reality data default.

  const viewCreatorOptions = useMemo(
    () => ({ viewportConfigurer: viewConfiguration }),
    [viewConfiguration]
  );

  const onIModelAppInit = useCallback(async () => {
    // iModel now initialized
    await TreeWidget.initialize();
    await PropertyGridManager.initialize();
    await MeasureTools.startup();
    MeasurementActionToolbar.setDefaultActionProvider();
  }, []);

  const categoryModelSelection = async (
    categoryIds: string[],
    modelIds: string[]
  ) => {
    const iModel = IModelApp.viewManager.selectedView?.iModel;
    let queryParams: any = {};
    if (iModel) {
      let query = querySelectionContext;
      if (categoryIds.length === 0 && modelIds.length === 0) {
        Presentation.selection.clearSelection("category/model", iModel, 0);
        const emphasize = EmphasizeElements.getOrCreate(
          IModelApp.viewManager.selectedView!
        );
        emphasize.clearEmphasizedElements(IModelApp.viewManager.selectedView!);
        return;
      } else if (categoryIds.length > 0 && modelIds.length > 0) {
        query += "InVirtualSet(?, Category.Id) AND InVirtualSet(?, Model.Id)";
        queryParams = [categoryIds, modelIds];
      } else if (modelIds.length > 0) {
        query += "InVirtualSet(?, Model.Id)";
        queryParams = [modelIds];
      } else if (categoryIds.length > 0) {
        query += "InVirtualSet(?, Category.Id)";
        queryParams = [categoryIds];
      }

      const queryReader = iModel.createQueryReader(
        query,
        QueryBinder.from(queryParams),
        { rowFormat: QueryRowFormat.UseECSqlPropertyNames }
      );
      const elements = await queryReader.toArray();
      Presentation.selection.replaceSelection(
        "category/model",
        iModel,
        elements.map((element) => ({
          id: element.id,
          className: element.classname,
        }))
      );
    }
  };

  const categoryIdsChanged = (ids: string[]) => {
    setSelectedCategoryIds(ids);
    categoryModelSelection(ids, selectedModelIds);
  };

  const modelIdsChanged = (ids: string[]) => {
    setSelectedModelIds(ids);
    categoryModelSelection(selectedCategoryIds, ids);
  };

  return (
    <CategoryModelContext.Provider
      value={{
        querySelectionContext,
        selectedCategoryIds,
        setSelectedCategoryIds: categoryIdsChanged,
        selectedModelIds,
        setSelectedModelIds: modelIdsChanged,
      }}
    >
      <div className="viewer-container">
        {!accessToken && (
          <FillCentered>
            <div className="signin-content">
              <ProgressLinear indeterminate={true} labels={["Signing in..."]} />
            </div>
          </FillCentered>
        )}

        <Viewer
          iTwinId={iTwinId ?? ""}
          iModelId={iModelId ?? ""}
          changeSetId={changesetId}
          authClient={authClient}
          viewCreatorOptions={viewCreatorOptions}
          enablePerformanceMonitors={true} // see description in the README (https://www.npmjs.com/package/@itwin/web-viewer-react)
          onIModelAppInit={onIModelAppInit}
          uiProviders={[
            new LeftPanelUIProvider(),
            new BottomGridUIProvider(),
            new ViewerNavigationToolsProvider(),
            new ViewerContentToolsProvider({
              vertical: {
                measureGroup: false,
              },
            }),
            new ViewerStatusbarItemsProvider(),
            new TreeWidgetUiItemsProvider(),
            new PropertyGridUiItemsProvider({
              propertyGridProps: {
                autoExpandChildCategories: true,
                ancestorsNavigationControls: (props) => (
                  <AncestorsNavigationControls {...props} />
                ),
                contextMenuItems: [
                  (props) => <CopyPropertyTextContextMenuItem {...props} />,
                ],
                settingsMenuItems: [
                  (props) => (
                    <ShowHideNullValuesSettingsMenuItem
                      {...props}
                      persist={true}
                    />
                  ),
                ],
              },
            }),
            new MeasureToolsUiItemsProvider(),
          ]}
          mapLayerOptions={mapLayerOptions}
          tileAdmin={tileAdminOptions}
        />
      </div>
    </CategoryModelContext.Provider>
  );
};

export default App;
