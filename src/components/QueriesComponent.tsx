import React from "react";
import Querycompt, { Queryprops } from "./querycompt";
import { ColorDef, QueryRowFormat } from "@itwin/core-common";
import { IModelApp } from "@itwin/core-frontend";
import { Presentation } from "@itwin/presentation-frontend";
import { Button, Flex } from "@itwin/itwinui-react";

export function QueriesComponent() {
  const [query, setQuery] = React.useState<Queryprops>({
    id: 42,
    enabled: true,
    color: ColorDef.blue,
    query: "",
  });

  function queryChanged(newProps: Queryprops): void {
    setQuery(newProps);
  }

  function removedclick(id: number): void {
    throw new Error("Function not implemented.");
  }

  async function selectElements(query: Queryprops) {
    const iModel = IModelApp.viewManager.selectedView?.iModel;
    if (iModel) {
      const queryReader = iModel.createQueryReader(query.query, undefined, {
        rowFormat: QueryRowFormat.UseECSqlPropertyNames,
      });
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

  function selectClicked(): void {
    selectElements(query);
  }

  return (
    <div>
      <Flex style={{ padding: "20px", width: "100%", height: "10px" }}>
        <h2>Enter Query</h2>
      </Flex>
      <Flex style={{ padding: "5px", width: "100%" }}>
        <Querycompt
          key={query.id}
          props={query}
          handleChange={queryChanged}
          removeClick={removedclick}
        />
        <Button onClick={selectClicked}>Enter</Button>
      </Flex>
    </div>
  );
}
