import React, { useState } from "react";

const Slider = ({
  min,
  max,
  initialValue,
  onSliderSubmit,
  setScoreIndex,
  //   setSliderPercent,
}) => {
  const [value, setValue] = useState(initialValue);

  const handleSliderChange = (event) => {
    const sliderValue = parseInt(event.target.value);
    setValue(sliderValue);
    // setSliderPercent(sliderValue); // Pass the slider value to the parent component
  };

  const handleSliderSubmit = () => {
    setScoreIndex((prevScoreIndex) => prevScoreIndex + 1);
    onSliderSubmit(value);
    // setSliderPercent(value);
  };

  return (
    <div className="slider-container">
      <h2>
        What percentage of people agree with you that this is the safer
        technology?
      </h2>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleSliderChange}
        // setSliderPercent={setSliderPercent}
        className="slider"
      />
      <div>{value}</div>
      <button onClick={handleSliderSubmit}>Submit</button>
    </div>
  );
};

export default Slider;
