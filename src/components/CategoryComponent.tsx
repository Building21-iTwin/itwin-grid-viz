import { IModelApp } from "@itwin/core-frontend";
import React, { useEffect, useState } from "react";
import { QueryBinder, QueryRowFormat } from "@itwin/core-common";
import { Presentation } from "@itwin/presentation-frontend";
import { Tooltip } from "@itwin/itwinui-react";
import { SearchBox } from '@itwin/itwinui-react';
import { Flex } from '@itwin/itwinui-react';
import { useContext } from "react";
import { CategoryContext } from "../App";

interface Category {
  label: string;
  id: string;
}

export function CategoryComponent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { selectedCategoryId, setSelectedCategoryId } =
    useContext(CategoryContext);
  const [searchString, setSearchString] = useState<string>("");

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

  let searchTextLower = searchString.toLowerCase();
  let filteredCategories = categories.filter((category) => {
    const categoryLower = category.label.toLowerCase();
    return categoryLower.includes(searchTextLower);
  });
  const categoryElements = filteredCategories.map((category) => (
    <ul key={category.id}>
      <input
        type="radio"
        id={category.id}
        name="category"
        checked={selectedCategoryId === category.id}
        onChange={handleCategoryChange}
      />
      <Tooltip content="Select category" placement="bottom">
        <label htmlFor={category.id}>{category.label}</label>
      </Tooltip>
    </ul>
  ));

  function searchInputChanged(event: any): void {
    setSearchString( event.target.value)}

    <header>
      
    </header>
      
  return (
    
    <div className=''>
    <SearchBox className="SearchBox"
    style={{position:"absolute", width:"80", left:"5px", right:"5px",top :"1px"}}
    aria-label='Search input'
    inputProps={{
      placeholder: 'Search Categories...', 
    }}
    onChange={searchInputChanged}
  />
<></>

<Flex
flexDirection="column" 
gap ='3x1'
 alignItems='left'>
<body>{categoryElements}</body>
</Flex> 
    </div>
  );
}
