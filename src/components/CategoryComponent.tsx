import {
  EmphasizeElements,
  IModelApp,
  SelectionSetEvent,
} from "@itwin/core-frontend";
import React, { useEffect, useState } from "react";
import { QueryBinder, QueryRowFormat } from "@itwin/core-common";
import { Presentation } from "@itwin/presentation-frontend";
import { Tooltip } from "@itwin/itwinui-react";
import { SearchBox } from "@itwin/itwinui-react";
import { Flex } from "@itwin/itwinui-react";
import { useContext } from "react";
import { CategoryModelContext } from "../App";

interface Category {
  label: string;
  id: string;
}

export function CategoryComponent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { selectedCategoryIds, setSelectedCategoryIds } =
    useContext(CategoryModelContext);
  const [searchString, setSearchString] = useState<string>("");
  const iModel = IModelApp.viewManager.selectedView?.iModel;

  useEffect(() => {
    const getCategories = async () => {
      if (iModel) {
        const queryReader = iModel.createQueryReader(
          "SELECT ECInstanceId, COALESCE(UserLabel, CodeValue) FROM bis.SpatialCategory WHERE ECInstanceId IN (SELECT DISTINCT Category.Id FROM bis.GeometricElement3d WHERE Category.Id IS NOT NULL)"
        );
        const cats = await queryReader.toArray();
        setCategories(cats.map((cat) => ({ id: cat[0], label: cat[1] })));
      }
    };
    const selectionListener = () => {
      const view = IModelApp.viewManager.selectedView;
      if (view) {
        if (view) {
          const emphasize = EmphasizeElements.getOrCreate(view);
          const appearance = emphasize
            .createDefaultAppearance()
            .clone({ nonLocatable: undefined });
          emphasize.emphasizeSelectedElements(view, appearance, true, false);
        }
      }
    };
    const iModel = IModelApp.viewManager.selectedView!.iModel;
    if (iModel) {
      if (!iModel.selectionSet.onChanged.has(selectionListener)) {
        iModel.selectionSet.onChanged.addListener(selectionListener);
      }
    }
    if (categories.length === 0) {
      getCategories();
    }
  }, [categories]);

  const handleCategoryChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const categoryIds = event.target.id;
    if (iModel) {
      const newSelectedIds = selectedCategoryIds.includes(categoryIds)
        ? selectedCategoryIds.filter((id) => id !== categoryIds)
        : [...selectedCategoryIds, categoryIds];

      setSelectedCategoryIds(newSelectedIds);
    }
  };

  let searchTextLower = searchString.toLowerCase();
  let filteredCategories = categories.filter((category) => {
    const categoryLower = category.label.toLowerCase();
    return categoryLower.includes(searchTextLower);
  });
  const categoryElements = filteredCategories.map((category) => (
    <ul key={category.id}>
      <input
        type="checkbox"
        id={category.id}
        name="category"
        checked={selectedCategoryIds.includes(category.id)}
        onChange={handleCategoryChange}
      />
      <Tooltip content="Select category" placement="bottom">
        <label htmlFor={category.id}>{category.label}</label>
      </Tooltip>
    </ul>
  ));

  function searchInputChanged(event: any): void {
    setSearchString(event.target.value);
  }

  <header></header>;

  return (
    <div className="">
      <SearchBox
        className="SearchBox"
        style={{ position: "sticky", width: "75", right: "10px", top: "1px" }}
        aria-label="Search input"
        inputProps={{
          placeholder: "Search Categories...",
        }}
        onChange={searchInputChanged}
      />

      <Flex flexDirection="column" gap="3x1" alignItems="left">
        <body>{categoryElements}</body>
      </Flex>
    </div>
  );
}
