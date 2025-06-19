import * as React from "react";
import { LabeledTextarea } from "@itwin/itwinui-react";
import { Flex } from "@itwin/itwinui-react";
import { ColorDef } from "@itwin/core-common";

export interface Queryprops {
  id: number;
  enabled: boolean;
  color: ColorDef;
  query: string;
  valid?: boolean;
  errormessage?: string;
}

export interface QueryComponentProps {
  props: Queryprops;
  handleChange(newProps: Queryprops): void;
  removeClick(id: number): void;
}

const Querycompt = ({ props, handleChange }: QueryComponentProps) => {
  const [value, setvalue] = React.useState<string>(props.query);

  function queryChanged(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    setvalue(event.target.value);
    handleChange(props);
    props.query = event.target.value;
  }

  let s: undefined | "positive" | "negative" = undefined;
  if (props.valid === true) {
    s = "positive";
  }
  if (props.valid === false) {
    s = "negative";
  }

  return (
    <Flex style={{ padding: "5px", width: "100%" }}>
      <LabeledTextarea
        id="text-area"
        value={value}
        onChange={queryChanged}
        style={{ width: "100%" }}
        label={undefined}
        status={s}
        message={props.errormessage}
        placeholder="Enter SQL here..."
      />
    </Flex>
  );
};
export default Querycompt;
