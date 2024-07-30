import { Button, Flex } from "@itwin/itwinui-react";
import React from "react";
import Querycompt, { Queryprops } from "./ESQueryComponent";

const SQLComponent = () => {
  const [queryList, SetQueryList] = React.useState<Queryprops[]>([]);
  const [count, setCount] = React.useState<number>(0);

  return (
    <div style={{ padding: "5px 5px 5px 5px" }}>
      <Flex flexDirection="row"></Flex>

      <Flex flexDirection="column"></Flex>
      <p>
        <small>
          <b>
            Add Button: Creates a list of queries in the form of a text box on
            the right, a check box which opens and closes the text box so the
            user can properly right text in it, a color box that allows the user
            to change the color of the text within the text box, and a remove
            button which removes the query that the add button created
          </b>
        </small>
      </p>
      <p>
        <small>
          <b>
            Emphasize Button: Allows the use to change the properties of a
            selected item in the 3d model. This is done by selecting an item in
            the 3d model, viewing its Generic:PhysicalObject: in the Debug
            Widget. Then, type in: Select EcInstanceId From
            Generic:PhysicalObject. This changes the color of the selected part
            of the 3d model
          </b>
        </small>
      </p>
      <p>
        <small>
          <b>
            Clear Button: Clears the color of the highlighted object inside the
            3d Model Viewer
          </b>
        </small>
      </p>
    </div>
  );
};

export default SQLComponent;
