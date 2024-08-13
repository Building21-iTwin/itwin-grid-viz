import { IModelApp } from "@itwin/core-frontend";
import React, { useContext, useEffect, useState } from "react";
import { QueryBinder, QueryRowFormat } from "@itwin/core-common";
import { Presentation } from "@itwin/presentation-frontend";
import { Category_ModelContext } from "../App";

interface Model {
  label: string;
  id: string;
}

export function ModelComponent() {
  const [models, setModels] = useState<Model[]>([]);
  const {
    querySelectionContext,
    selectedCategoryIds,
    selectedModelIds,
    setSelectedModelIds,
  } = useContext(Category_ModelContext);
  const iModel = IModelApp.viewManager.selectedView?.iModel;

  useEffect(() => {
    const getModels = async () => {
      if (iModel) {
        const queryReader = iModel.createQueryReader(
          "SELECT m.ECInstanceId modelId, COALESCE(p.UserLabel, CodeValue) FROM bis.PhysicalModel m JOIN bis.PhysicalPartition p ON p.ECInstanceId = m.ModeledElement.Id"
        );
        const cats = await queryReader.toArray();
        setModels(cats.map((cat) => ({ id: cat[0], label: cat[1] })));
      }
    };

    getModels();
  }, [models]);

  async function selectModel(modelIds: string[]) {
    if (iModel) {
      if (selectedCategoryIds.length === 0) {
        const queryReader = iModel.createQueryReader(
          querySelectionContext + "(?, Model.Id)",
          QueryBinder.from([modelIds]),
          { rowFormat: QueryRowFormat.UseECSqlPropertyNames }
        );
        const elements = await queryReader.toArray();
        Presentation.selection.replaceSelection(
          "model",
          iModel,
          elements.map((element) => ({
            id: element.id,
            className: element.classname,
          }))
        );
      } else {
        const queryReader = iModel.createQueryReader(
          querySelectionContext +
            "(?, Model.Id) AND InVirtualSet(?, Category.Id)",
          QueryBinder.from([modelIds, [selectedCategoryIds]]),
          { rowFormat: QueryRowFormat.UseECSqlPropertyNames }
        );
        const elements = await queryReader.toArray();
        Presentation.selection.replaceSelection(
          "model",
          iModel,
          elements.map((element) => ({
            id: element.id,
            className: element.classname,
          }))
        );
      }
    }
  }

  const handleModelChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const modelIds = event.target.id;

    if (iModel) {
      const isSelected = selectedModelIds.includes(modelIds);
      const newSelectedIds = isSelected
        ? selectedModelIds.filter((id) => id !== modelIds)
        : [...selectedModelIds, modelIds];

      if (newSelectedIds.length > 0) {
        setSelectedModelIds(newSelectedIds);
        if (isSelected) {
          Presentation.selection.clearSelection("model", iModel, 0);
        }
        await selectModel(newSelectedIds);
      } else {
        setSelectedModelIds([]);
        Presentation.selection.clearSelection("model", iModel, 0);
      }
    }
  };

  const modelElements = models.map((model) => (
    <li key={model.id}>
      <input
        type="checkbox"
        id={model.id}
        name="model"
        checked={selectedModelIds.includes(model.id)}
        onChange={handleModelChange}
      />
      <label htmlFor={model.id}>{model.label}</label>
    </li>
  ));

  return (
    <div>
      <ul>{modelElements}</ul>
    </div>
  );
}
