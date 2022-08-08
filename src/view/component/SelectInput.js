import React from "react";

const InputDropDown = ({
  options = [],
  setSelectedValue,
  handleFormData,
  name,
}) => {
  // return <div>hello</div>;
  return (
    <select
      name={name}
      onChange={(e) => handleFormData(e)}
      className="selectInput"
    >
      {options?.map((item) => {
        return (
          <option value={item.title} className="selectInput">
            {item?.title}
          </option>
        );
      })}
    </select>
  );
};

export default InputDropDown;
