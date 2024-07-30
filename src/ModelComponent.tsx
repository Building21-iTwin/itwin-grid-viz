import { IModelApp } from "@itwin/core-frontend";
import React, { useContext, useEffect, useState } from "react";
import { QueryBinder, QueryRowFormat } from "@itwin/core-common";
import { Presentation } from "@itwin/presentation-frontend";
import { CategoryContext } from "./App";

interface Model {
  label: string;
  id: string;
}

export function ModelComponent() {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>();
  const { selectedCategoryId } = useContext(CategoryContext);

  useEffect(() => {
    const getModels = async () => {
      const iModel = IModelApp.viewManager.selectedView?.iModel;
      if (iModel) {
        const queryReader = iModel.createQueryReader(
          "SELECT m.ECInstanceId modelId, p.UserLabel modelName FROM bis.PhysicalModel m JOIN bis.PhysicalPartition p ON p.ECInstanceId = m.ModeledElement.Id"
        );
        const cats = await queryReader.toArray();
        setModels(cats.map((cat) => ({ id: cat[0], label: cat[1] })));
      }
    };

    getModels();
  }, [models]);

  async function selectModel(modelIds: string[], _categoryIds: string[]) {
    const iModel = IModelApp.viewManager.selectedView?.iModel;
    if (iModel) {
      if (selectedCategoryId === null) {
        const queryReader = iModel.createQueryReader(
          "SELECT ec_classname(ECClassId, 's:c') as [classname], ECInstanceId as [id] FROM bis.GeometricElement3d WHERE InVirtualSet(?, Model.Id)",
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
          "SELECT ec_classname(ECClassId, 's:c') as [classname], ECInstanceId as [id] FROM bis.GeometricElement3d WHERE InVirtualSet(?, Model.Id) AND InVirtualSet(?, Category.Id)",
          QueryBinder.from([modelIds, [selectedCategoryId]]),
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
    const modelId = event.target.id;
    const categoryId = event.target.id;

    setSelectedModelId(modelId);
    setSelectedModelId(categoryId);

    await selectModel([modelId], [categoryId]);
  };

  const modelElements = models.map((model) => (
    <li key={model.id}>
      <input
        type="radio"
        id={model.id}
        name="model"
        checked={selectedModelId === model.id}
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
