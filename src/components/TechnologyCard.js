import React, { useState } from "react";
import { useSpring, animated as a } from "react-spring";
import "./styles/TechnologyCard.css";

const TechnologyCard = ({
  tech,
  handleChoice,
  index,
  selectionMade,
  percent,
}) => {
  const [clicked, setClicked] = useState(false);

  const selectedCardProps = useSpring({
    to: clicked
      ? { transform: "scale(1.2)", opacity: 1, shadow: 30 }
      : { transform: "scale(1)", opacity: 1 },
    config: { tension: 210, friction: 20 },
  });

  const unselectedCardProps = useSpring({
    to: clicked
      ? { transform: "scale(0.6)", opacity: 0.6 }
      : { transform: "scale(1)", opacity: 1 },
    config: { tension: 210, friction: 20 },
  });

  const handleClick = () => {
    if (clicked || selectionMade) {
      return; // If a card is already selected, do nothing
    }
    handleChoice(index);
    setClicked(true);
  };

  return (
    <a.div
      style={clicked ? selectedCardProps : unselectedCardProps}
      className="technology-card"
      onClick={handleClick}
    >
      {!selectionMade ? (
        <div className="percentage-div">
          <h3>{tech.title}</h3>
        </div>
      ) : (
        <div className="percentage-div">
          <h3>{tech.title}</h3>
        </div>
      )}
    </a.div>
  );
};

export default TechnologyCard;
