import { Button, Flex, LabeledTextarea } from "@itwin/itwinui-react";
import React from "react";

export interface Queryprops {
  query: string;
  valid?: boolean;
  errormessage?: string;
}

export interface QueryComponentProps {
  props: Queryprops;
  handleChange(newProps: Queryprops): void;
}

const Querycompt = ({ props, handleChange }: QueryComponentProps) => {
  const [value, setvalue] = React.useState<string>(props.query);

  function queryChanged(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    setvalue(event.target.value);
    handleChange(props);
    props.query = event.target.value;
  }

  return (
    <Flex style={{ padding: "5px", width: "100%" }}>
      <Button styleType="default"></Button>
      <LabeledTextarea
        id="text-area"
        value={value}
        onChange={queryChanged}
        style={{ width: "100%" }}
        label={undefined}
        message={props.errormessage}
      />
    </Flex>
  );
};

export default Querycompt;
