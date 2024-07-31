import React, { useState } from 'react';
import { Flex, Checkbox, Button, LabeledTextarea } from '@itwin/itwinui-react';
import { ColorPickerButton } from '@itwin/imodel-components-react';


const TextBoxComponent = (props: { errormessage: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) => {
  const [checkBoxChecked, setCheckBoxChecked] = useState(false);
  const [value, setValue] = useState('');

  const handleCheckboxChange = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
    setCheckBoxChecked(event.target.checked);
  };

  const handleValueChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setValue(event.target.value);
  };

  const handleRemoveClick = () => {
    setValue('');
  };


  return (
    <Flex style={{ padding: '5px', width: '100%' }}>
      <Checkbox label="" checked={checkBoxChecked} onChange={handleCheckboxChange} />
      <Button styleType="default" onClick={handleRemoveClick}>Remove</Button>
      <LabeledTextarea
        id="text-area"
        value={value}
        onChange={handleValueChange}
        style={{ width: '100%' }}
        disabled={!checkBoxChecked}
        label="Text Area"
        message={props.errormessage}
      />
    </Flex>
  );
};

export default TextBoxComponent;


function setTextBoxes(arg0: any[]) {
    throw new Error('Function not implemented.');
}

