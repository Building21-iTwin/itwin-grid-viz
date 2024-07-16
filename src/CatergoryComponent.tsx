import { category } from "@itwin/appui-layout-react/lib/cjs/appui-layout-react/state/internal/NineZoneStateHelpers";
import { IModelApp } from "@itwin/core-frontend";
import React from "react";
import { useEffect, useState } from "react";

interface Catergory {
    label: string; 
    id: string; 
}

export function CatergoryComponent () {
    const [catergories,setCategories]= React.useState <Catergory[]>([]);
    useEffect(() => {
        const getCategories = async () => {
          const iModel = IModelApp.viewManager.selectedView?.iModel;
          if (iModel) {
            const queryReader = iModel.createQueryReader("SELECT ECInstanceId, UserLabel FROM bis.SpatialCategory");
            const cats = await queryReader.toArray();
            setCategories(cats.map((cat) => ({ id: cat[0], label: cat[1] })));
          }
        };
     
      
        getCategories();
      }, [category]);
   
      const categoryElements = catergories.map ((category) => (
        <li key={category.id}> {category.label}</li>
      ))
return(
<div> 
<ul>  </ul>
 
 
    </div>
);
}

