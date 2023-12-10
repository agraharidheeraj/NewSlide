// DraggableTextarea.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Draggable from "react-draggable";
import { Textarea } from "@chakra-ui/react";
import { selectTextArea } from "../ReduxStore/textAreasSlice";

const DraggableTextarea = ({ id, ...props }) => {
  const dispatch = useDispatch();
  const selectedTextArea = useSelector(
    (state) => state.textAreas.selectedTextArea
  );

  const isSelected = selectedTextArea === id;

  const handleTextareaClick = () => {
    dispatch(selectTextArea(id));
  };

  return (
    <Draggable>
      <div
        style={{
          position: "relative",
          width: "fit-content",
          height: "fit-content",
          outline: "none",
        }}
      >
        <Textarea
          onClick={handleTextareaClick}
          {...props}
          style={{
            resize: "both",
            overflow: "auto",
            cursor: isSelected ? "grab" : "default",
            position: "absolute",
            width: "100%",
            height: "100%",
            outline: "none",
          }}
        />
      </div>
    </Draggable>
  );
};

export default DraggableTextarea;
