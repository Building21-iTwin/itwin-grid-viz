import { IModelApp } from "@itwin/core-frontend";
import React, { useContext, useEffect, useState } from "react";
import { QueryBinder, QueryRowFormat } from "@itwin/core-common";
import { Presentation } from "@itwin/presentation-frontend";
import { CategoryModelContext } from "../App";
import { SearchBox } from "@itwin/itwinui-react/cjs/core/SearchBox";
import { Tooltip } from "@itwin/itwinui-react/cjs/core/Tooltip";
import { Button, Flex } from "@itwin/itwinui-react";

interface Model {
  label: string;
  id: string;
}

export function ModelComponent() {
  const [models, setModels] = useState<Model[]>([]);
  const { selectedModelIds, setSelectedModelIds } =
    useContext(CategoryModelContext);
  const [searchString, setSearchString] = useState<string>("");
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
    if (models.length === 0) {
      getModels();
    }
  }, [models]);

  const handleModelChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const modelIds = event.target.id;

    if (iModel) {
      const isSelected = selectedModelIds.includes(modelIds);
      const newSelectedIds = isSelected
        ? selectedModelIds.filter((id) => id !== modelIds)
        : [...selectedModelIds, modelIds];

      setSelectedModelIds(newSelectedIds);
    }
  };

  let searchTextLower = searchString.toLowerCase();
  let filteredModels = models.filter((category) => {
    const categoryLower = category.label.toLowerCase();
    return categoryLower.includes(searchTextLower);
  });

  const modelElements = filteredModels.map((model) => (
    <li key={model.id}>
      <input
        type="checkbox"
        id={model.id}
        name="model"
        checked={selectedModelIds.includes(model.id)}
        onChange={handleModelChange}
      />
      <Tooltip content="Select Model" placement="bottom">
        <label htmlFor={model.id}>{model.label}</label>
      </Tooltip>
    </li>
  ));

  function searchInputChanged(event: any): void {
    setSearchString(event.target.value);
  }

  function ClearBoxes(): void {
    setSelectedModelIds([])
  }

  return (
    <div className="">
      <Flex
      style={{position: "absolute"}}> <SearchBox
        className="SearchBox"
        style={{ position: "sticky", width: "75", right: "10px", top: "1px" }}
        aria-label="Search input"
        inputProps={{
          placeholder: "Search Models...",
        }}
        onChange={searchInputChanged}
      /> <Button onClick={ClearBoxes}>Clear</Button>
    </Flex>
      <ul>{modelElements}</ul>
    </div>
  );
}
