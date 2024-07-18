import { category } from "@itwin/appui-layout-react/lib/cjs/appui-layout-react/state/internal/NineZoneStateHelpers";
import { IModelApp } from "@itwin/core-frontend";
import React, { useEffect } from "react";

interface Category {
  label: string;
  id: string;
}

export function CategoryComponent() {
  const [categories, setCategories] = React.useState<Category[]>([]);

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
  }, []);

  const categoryElements = categories.map((category) => (
    <li key={category.id}>
      <input type="checkbox" id={category.id} />
      <label htmlFor={category.id}>{category.label}</label>
    </li>
  ));

  return (
    <div>
      <ul>{categoryElements}</ul>
    </div>
  );
}
