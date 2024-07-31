import React, { useState } from "react";
import { Button, Flex, LabeledTextarea } from "@itwin/itwinui-react";

export interface QueryProps {
  id: number;
  enabled: boolean;
  query: string;
  valid?: boolean;
  errorMessage?: string;
}

export interface QueryComponentProps {
  props: QueryProps;
  handleChange(newProps: QueryProps): void;
  enterClick(id: number): void;
}

const Querycompt = ({ props, enterClick }: QueryComponentProps) => {
  const [query, setQuery] = useState(props.query);

  const handleQueryChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(event.target.value);
  };

  const handleEnterClick = () => {
    enterClick(props.id);
  };

  return (
    <Flex style={{ padding: "5px", width: "100%" }}>
      <Button styleType="default" onClick={handleEnterClick}>
        Enter
      </Button>
      <LabeledTextarea
        label="SQL Code"
        value={query}
        onChange={handleQueryChange}
        placeholder="Enter SQL code here"
      />
    </Flex>
  );
};

export default Querycompt;
