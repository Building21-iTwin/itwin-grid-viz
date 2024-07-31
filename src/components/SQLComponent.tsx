import React from "react";
import { Button, Flex } from "@itwin/itwinui-react";
import QueryComponent, { QueryComponentProps, QueryProps } from "./QueryCompt";
import Querycompt from "./QueryCompt";

const SQLWidget = () => {
  const [queryList, SetQueryList] = React.useState<QueryProps[]>([]);
  const [count, setCount] = React.useState<number>(0);

  function addQuery(
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    const newQueryList = [...queryList];
    newQueryList.push({ id: count, enabled: false, query: "" });
    SetQueryList(newQueryList);
    setCount(count + 1);
  }

  function queryChanged(_newProps: QueryProps): void {
    const newList = queryList.map((q: QueryProps) => {
      if (q.id === _newProps.id) {
        return _newProps;
      }
      return q;
    });
    SetQueryList(newList);
  }

  const queryElements: JSX.Element[] = [];
  queryList.forEach((p: QueryProps) => {
    queryElements.push(
      <Querycompt
        key={p.id}
        props={p}
        handleChange={queryChanged}
        enterClick={handleEnterClick}
      />
    );
  });

  return (
    <div style={{ padding: "5px" }}>
      <Flex flexDirection="row">
        <Button styleType="high-visibility" onClick={addQuery}>
          Add
        </Button>
      </Flex>

      <Flex flexDirection="column">{queryElements}</Flex>
    </div>
  );
};

export default SQLWidget;

function handleEnterClick(id: number): void {
  throw new Error("Function not implemented.");
}
