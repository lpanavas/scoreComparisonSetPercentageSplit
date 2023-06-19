import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/SliderComponent.css";
import Comparisons from "../data/comparisons.json";

function SliderComponent({
  onSliderSubmit,
  setScoreIndex,
  setSliderPercent,
  selectedCard,
  setShowGame,
}) {
  const [value, setValue] = useState(50);
  const [trueValue, setTrueValue] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [shrinking, setShrinking] = useState(false);
  const [publicOpinion, setPublicOpinion] = useState(false);

  useEffect(() => {
    const selectedTech = selectedCard[0].title;

    const unselectedTech = selectedCard[1].title;

    const foundComparison = Comparisons.comparisons.find(
      (comp) =>
        (comp.title1 === selectedTech && comp.title2 === unselectedTech) ||
        (comp.title1 === unselectedTech && comp.title2 === selectedTech)
    );

    let truePercent;

    if (foundComparison) {
      if (foundComparison.title1 === selectedTech) {
        truePercent = foundComparison.percent1;
      } else {
        truePercent = foundComparison.percent2;
      }
    }
    setTrueValue(truePercent);
  }, []);

  useEffect(() => {
    if (submitted) {
      setTimeout(() => {
        setShrinking(true);
      }, 3500); // adjust this delay to control the duration of the growing phase
    }
  }, [submitted]);

  const handleChange = (event) => {
    setSliderPercent(value);
    setValue(event.target.value);
  };

  const handleSubmit = () => {
    if (value > trueValue) {
      setPublicOpinion(false);
    }
    setSliderPercent(value);
    setSubmitted(true);
    setTimeout(() => {
      setScoreIndex((prevScoreIndex) => prevScoreIndex + 1);
      onSliderSubmit(value);
      setShowGame(false);
      //   setShowGame{false}

      setPublicOpinion(true);
    }, 7000); // You may adjust this delay to better fit your animation
  };

  const leftWidth = Math.min(value, trueValue);
  const rightWidth = 100 - Math.max(value, trueValue);
  const middleWidth = Math.abs(
    Math.max(value, trueValue) - Math.min(value, trueValue)
  );

  const leftStart = 0;
  const middleStart = leftWidth;
  const rightStart = leftWidth + middleWidth;

  return (
    <div className="slider-wrapper">
      <h3>
        What percentage of people agree with you that this is the safer
        technology?
      </h3>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        className="slider"
        onChange={handleChange}
      />
      <div className="slider-value">{value}%</div>{" "}
      {/* Display slider value here */}
      {!submitted && (
        <button
          className={`button-different ${submitted ? "button-hidden" : ""}`}
          onClick={handleSubmit}
        >
          Submit
        </button>
      )}
      {submitted && (
        <div className="bar-container">
          {shrinking ? (
            <>
              <motion.div
                style={{ width: `${leftWidth}%`, left: `${leftStart}%` }}
                className="left-bar"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              />
              <motion.div
                style={{ width: `${middleWidth}%`, left: `${leftWidth}%` }}
                className="middle-bar"
                initial={{ opacity: 1 }}
                animate={{ width: 0, opacity: 0 }}
                transition={{ duration: 1 }}
              />
              <motion.div
                style={{
                  width: `${rightWidth}%`,
                  left: `${leftWidth + middleWidth}%`,
                }}
                className="right-bar"
                initial={{ opacity: 1 }}
                animate={{ left: `${leftWidth}%`, opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              />
            </>
          ) : (
            <>
              <motion.div
                style={{ width: 0, left: `${leftStart}%` }}
                className={`left-bar-public ${
                  publicOpinion ? "left-bar-your" : ""
                }`}
                initial={{ x: -100, opacity: 0 }}
                animate={{ width: `${leftWidth}%`, x: 0, opacity: 1 }}
                transition={{ duration: 1 }}
              ></motion.div>
              <motion.div
                style={{ width: 0, left: `${middleStart}%` }}
                className="middle-bar"
                initial={{ x: 0, opacity: 0 }}
                animate={{ width: `${middleWidth}%`, x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              />
              <motion.div
                style={{ width: 0, left: `${rightStart}%` }}
                className={`right-bar-your ${
                  publicOpinion ? "right-bar-public" : ""
                }`}
                initial={{ x: 0, opacity: 0 }}
                animate={{ width: `${rightWidth}%`, x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 2 }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SliderComponent;
