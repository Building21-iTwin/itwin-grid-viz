import { IModelApp } from "@itwin/core-frontend";
import React, { useEffect, useState } from "react";
import { QueryBinder, QueryRowFormat } from "@itwin/core-common";
import { Presentation } from "@itwin/presentation-frontend";
import { useContext } from "react";
import { CategoryContext, CategoryContextType } from "./App";

interface Category {
  label: string;
  id: string;
}

export function CategoryComponent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { selectedCategoryId, setSelectedCategoryId } =
    useContext(CategoryContext);

  useEffect(() => {
    const getCategories = async () => {
      const iModel = IModelApp.viewManager.selectedView?.iModel;
      if (iModel) {
        const queryReader = iModel.createQueryReader(
          "SELECT ECInstanceId, UserLabel FROM bis.SpatialCategory"
        );
        const cats = await queryReader.toArray();
        setCategories(cats.map((cat) => ({ id: cat[0], label: cat[1] })));
      }
    };

    getCategories();
  }, [categories]);

  async function selectCategory(ids: string[]) {
    const iModel = IModelApp.viewManager.selectedView?.iModel;
    if (iModel) {
      const queryReader = iModel.createQueryReader(
        "SELECT ec_classname(ECClassId, 's:c') as [classname], ECInstanceId as [id] FROM bis.GeometricElement3d WHERE InVirtualSet(?, Category.Id)",
        QueryBinder.from([ids]),
        { rowFormat: QueryRowFormat.UseECSqlPropertyNames }
      );
      console.log(selectedCategoryId);
      const elements = await queryReader.toArray();
      Presentation.selection.replaceSelection(
        "category",
        iModel,
        elements.map((element) => ({
          id: element.id,
          className: element.classname,
        }))
      );
    }
  }

  const handleCategoryChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const categoryId = event.target.id;
    setSelectedCategoryId(categoryId);
    await selectCategory([categoryId]);
  };

  const categoryElements = categories.map((category) => (
    <li key={category.id}>
      <input
        type="radio"
        id={category.id}
        name="category"
        checked={selectedCategoryId === category.id}
        onChange={handleCategoryChange}
      />
      <label htmlFor={category.id}>{category.label}</label>
    </li>
  ));

  return (
    <div>
      <ul>{categoryElements}</ul>
    </div>
  );
}
