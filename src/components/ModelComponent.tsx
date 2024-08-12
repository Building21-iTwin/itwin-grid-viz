import { IModelApp } from "@itwin/core-frontend";
import React, { useContext, useEffect, useState } from "react";
import { QueryBinder, QueryRowFormat } from "@itwin/core-common";
import { Presentation } from "@itwin/presentation-frontend";
import { CategoryContext } from "../App";
import { SearchBox } from "@itwin/itwinui-react/cjs/core/SearchBox";
import { Tooltip } from "@itwin/itwinui-react/cjs/core/Tooltip";


interface Model {
  label: string;
  id: string;
}

export function ModelComponent() {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>();
  const { selectedCategoryId } = useContext(CategoryContext);
  const [searchString, setSearchString] = useState<string>("");

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
  let searchTextLower = searchString.toLowerCase();
  let filteredModels = models.filter((category) => {
    const categoryLower = category.label.toLowerCase();
    return categoryLower.includes(searchTextLower);
  });

  const modelElements = filteredModels.map((model) => (
    <li key={model.id}>
      <input
        type="radio"
        id={model.id}
        name="model"
        checked={selectedModelId === model.id}
        onChange={handleModelChange}
      />
      <Tooltip content="Select Model" placement="bottom">
      <label htmlFor={model.id}>{model.label}</label>
      </Tooltip>
    </li>
  ));

  function searchInputChanged(event: any): void {
    setSearchString( event.target.value)}

  return (
    <div className=''>
    <SearchBox className="SearchBox"
    style={{position:"sticky", width:"75", right:"10px", top: "1px"}}
    aria-label='Search input'
    inputProps={{
      placeholder: 'Search Models...', 
    }}
    onChange={searchInputChanged}
  />
<></>
      <ul>{modelElements}</ul>
    </div>
  );
}
