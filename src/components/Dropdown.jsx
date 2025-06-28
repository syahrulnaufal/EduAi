import React, { useState } from 'react';
import Select from 'react-select';

function Dropdown({data, selectedOption, handleChange, placeholder}) {
  // const data = [
  //   {
  //     value: 1,
  //     label: "cerulean"
  //   },
  //   {
  //     value: 2,
  //     label: "fuchsia rose"
  //   },
  //   {
  //     value: 3,
  //     label: "true red"
  //   },
  //   {
  //     value: 4,
  //     label: "aqua sky"
  //   },
  //   {
  //     value: 5,
  //     label: "tigerlily"
  //   },
  //   {
  //     value: 6,
  //     label: "blue turquoise"
  //   }
  // ];

  // const [selectedOption, setSelectedOption] = useState(null);

  // // handle onChange event of the dropdown
  // const handleChange = e => {
  //   setSelectedOption(e);
  // }

  return (
    <div className="Dropdown">
      <Select
        placeholder={placeholder || "Pilih kelas"}
        value={selectedOption} // set selected value
        options={data} // set list of the data
        onChange={handleChange} // assign onChange function
      />

      {/* {selectedOption && <div style={{ marginTop: 20, lineHeight: '25px' }}>
        <b>Selected Option</b><br />
        <div style={{ marginTop: 10 }}><b>Label: </b> {selectedOption.label}</div>
        <div><b>Value: </b> {selectedOption.value}</div>
      </div>} */}
    </div>
  );
}

export default Dropdown;
