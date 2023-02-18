import { useState } from "react";
import { TextareaAutosize } from "@material-ui/core";

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
}

const EditableText = ({ value, onChange }: EditableTextProps) => {
 
  const [text, setText] = useState(value);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleEnterKey = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {

      onChange(text);
    }
  };

  const handleFocusOut = () => {

    onChange(text);
  };

  return  (
    <TextareaAutosize
      autoFocus
      value={text}
      onChange={handleTextChange}
      onKeyPress={handleEnterKey}
      onBlur={handleFocusOut}
    />
  ) 
};

export default EditableText;
