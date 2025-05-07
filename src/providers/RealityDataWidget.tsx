import { useActiveViewport } from "@itwin/appui-react";
import React, { useEffect, useState } from "react";
import RealityDataApi from "./RealityDataApi";
import "./RealityDataWidget.css";

export const RealityDataWidget: React.FC = () => {
  const viewport = useActiveViewport();
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    const asyncInitialize = async () => {
      if (viewport) {
        const realityModels = await RealityDataApi.getRealityModels(viewport.iModel);
        const classifiers = await RealityDataApi.getAvailableClassifierListForViewport(viewport);
        const classifier = classifiers.length > 0 ? classifiers[0].value : "";
        
        // Enable reality data by default
        for (const model of realityModels) {
          if (model.name === "Philadelphia_2015") {
            RealityDataApi.toggleRealityModel(model, viewport, true);
            if (classifier) {
              RealityDataApi.setRealityDataClassifier(viewport, classifier);
            }
          }
        }
      }
    };

    if (!initialized) {
      void asyncInitialize().then(() => { setInitialized(true); })
    }
  }, [viewport, initialized]);

  const handleToggle = async () => {
    if (viewport) {
      const realityModels = await RealityDataApi.getRealityModels(viewport.iModel);
      for (const model of realityModels) {
        if (model.name === "Philadelphia_2015") {
          RealityDataApi.toggleRealityModel(model, viewport, !isEnabled);
          console.log(`Reality data ${!isEnabled ? 'enabled' : 'disabled'}`);
        }
      }
      setIsEnabled(!isEnabled);
    }
  };

  return (
    <div className="reality-data-widget">
      <div className="emphasize-element-item">
        <div className="emphasize-element-item-part">
          <label>Reality Data: </label>
        </div>
        <div className="emphasize-element-item-part">
          <button onClick={handleToggle}>
            {isEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>
    </div>
  );
};