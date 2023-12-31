import React, { useState, useEffect } from "react";
import { useSpring, animated as a } from "react-spring"; // Added this line
import { useTrail, animated as b } from "react-spring";
import TechnologyCard from "./TechnologyCard";
import Rankings from "./Rankings";
import ScoreBar from "./ScoreBar";
import Comparisons from "../data/comparisons.json";
import ScoreLine from "./ScoreLine";
import TwoScoreLine from "./TwoScoreLine";
import Slider from "./Slider";
import SliderComponent from "./SliderComponent";

import Button from "./Button";
import "./styles/PairwiseGame.css";

const firstBad = ["Harmful", "Unjust", "Disloyal", "Disobedient", "Indecent"];
const firstGood = ["Protective", "Impartial", "Loyal", "Respectful", "Decent"];
const secondBad = [
  "Violent",
  "Discriminatory",
  "Traitor",
  "Defiant",
  "Obscene",
];
const secondGood = ["Caring", "Fair", "Devoted", "Lawful", "Virtuous"];
const descriptors = {
  firstDescriptors: [...firstBad, ...firstGood],
  secondDescriptors: [...secondBad, ...secondGood],
};

const PairwiseGame = ({ technologies, finishGame }) => {
  const [shuffledTechnologies, setShuffledTechnologies] = useState([]);

  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [rankings, setRankings] = useState({});
  const [selectedDescriptors, setSelectedDescriptors] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [unselectedCard, setUnselectedCard] = useState(null);
  const [descriptorStage, setDescriptorStage] = useState("firstDescriptors");
  const [progress, setProgress] = useState(0);
  const [selectionMade, setSelectionMade] = useState(false);
  const [selectedPercent, setSelectedPercent] = useState(0);
  const [unselectedPercent, setUnselectedPercent] = useState(0);
  const [firstClickTime, setFirstClickTime] = useState(null);
  const [descriptorClickTimes, setDescriptorClickTimes] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [scoreIndex, setScoreIndex] = useState(0);
  const [sliderValue, setSliderValue] = useState(50);
  const [displaySlider, setDisplaySlider] = useState(false);
  const [sliderPercent, setSliderPercent] = useState(0);
  const [showGame, setShowGame] = useState(true);

  useEffect(() => {
    if (technologies.length > 0) {
      // Shuffle technologies array
      let shuffledTechnologies = [...technologies];
      for (let i = shuffledTechnologies.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [shuffledTechnologies[i], shuffledTechnologies[j]] = [
          shuffledTechnologies[j],
          shuffledTechnologies[i],
        ];
      }

      // Create pairs from the shuffled technologies array
      let tempShuffledTechnologies = [];
      for (let i = 0; i < shuffledTechnologies.length; i += 2) {
        tempShuffledTechnologies.push([
          shuffledTechnologies[i],
          shuffledTechnologies[i + 1],
        ]);
      }

      // Limit the length of tempShuffledTechnologies to match the length of technologies
      tempShuffledTechnologies = tempShuffledTechnologies.slice(
        0,
        technologies.length
      );
      setShuffledTechnologies(tempShuffledTechnologies);

      // Use the original technologies array for the initial rankings
      let initialRankings = {};
      technologies.forEach((tech) => {
        initialRankings[tech.title] = {
          descriptors: [],
          wins: 0,
          losses: 0,
          ties: 0,
          opponents: {}, // Keep track of wins, losses, and ties against each opponent
        };
      });
      setRankings(initialRankings);
    }
  }, [technologies]);

  useEffect(() => {
    if (currentPairIndex >= technologies.length / 2) {
      setGameOver(true);
    }
  }, [currentPairIndex, technologies.length]);

  useEffect(() => {
    calculateProgress();
  }, [currentPairIndex]);

  const calculateProgress = () => {
    const totalPairs = Math.floor(technologies.length / 2);
    const currentProgress = (currentPairIndex / totalPairs) * 100;
    setProgress(currentProgress);
  };

  const handleChoice = (chosenIndex) => {
    // Adjustments to handle new shuffledTechnologies format
    setDescriptorClickTimes([]);
    setFirstClickTime(Date.now());

    if (selectedCard !== null) {
      return; // If a card is already selected, do nothing
    }

    const chosenCard = chosenIndex % 2 === 0 ? 0 : 1;

    setSelectedCard([
      shuffledTechnologies[currentPairIndex][chosenCard],
      shuffledTechnologies[currentPairIndex][(chosenCard + 1) % 2],
    ]);

    setSelectedIndex(chosenIndex);

    const selectedTech =
      shuffledTechnologies[currentPairIndex][chosenCard].title;

    const unselectedTech =
      shuffledTechnologies[currentPairIndex][(chosenCard + 1) % 2].title;

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
    setSelectedPercent(truePercent);
    setDisplaySlider(true);

    setSelectionMade(true);
  };

  const renderTechnologyCard = (index) => {
    const tech = shuffledTechnologies[currentPairIndex][index];

    return (
      <TechnologyCard
        key={tech.title}
        tech={tech}
        handleChoice={handleChoice}
        index={index}
        selectionMade={selectionMade}
        isClicked={index === selectedIndex}
      />
    );
  };

  const handleDescriptorSelection = (descriptor) => {
    setSelectedDescriptors((prevDescriptors) => {
      let newDescriptors;
      if (prevDescriptors.includes(descriptor)) {
        newDescriptors = prevDescriptors.filter((desc) => desc !== descriptor);
      } else {
        newDescriptors = [...prevDescriptors, descriptor];
      }

      // Calculate time difference before updating descriptorClickTimes
      const currentTime = Date.now();
      const lastClickTime =
        descriptorClickTimes.length > 0
          ? descriptorClickTimes[descriptorClickTimes.length - 1]
          : currentTime;
      const timeDifference = currentTime - lastClickTime;

      // If the time difference is more than half a second, increase the score
      if (timeDifference >= 1000) {
        // setScore((prevScore) => prevScore + 2);
      }

      setDescriptorClickTimes((prevTimes) => [...prevTimes, currentTime]);

      // Check if we should move onto the next stage or finish this round
      if (newDescriptors.length === 2) {
        if (descriptorStage === "firstDescriptors") {
          setDescriptorStage("secondDescriptors");

          newDescriptors = [];
        } else if (descriptorStage === "secondDescriptors") {
          // Calculate results and proceed to next pair
          let updatedRankings = { ...rankings };
          const selectedTech = selectedCard[0].title;
          const unselectedTech = selectedCard[1].title;

          // Update wins, losses, and opponents
          updatedRankings[selectedTech].wins += 1;
          updatedRankings[unselectedTech].losses += 1;
          updatedRankings[selectedTech].opponents[unselectedTech] =
            (updatedRankings[selectedTech].opponents[unselectedTech] || 0) + 1;
          updatedRankings[unselectedTech].opponents[selectedTech] =
            (updatedRankings[unselectedTech].opponents[selectedTech] || 0) - 1;

          // Update the descriptors
          updatedRankings[selectedTech].descriptors.push(...newDescriptors);

          setRankings(updatedRankings);
          setSelectedDescriptors([]);
          setSelectedCard(null);
          setUnselectedCard(null);
          setCurrentPairIndex(currentPairIndex + 1);
          setDescriptorStage("firstDescriptors"); // Reset the descriptor stage
          setSelectionMade(false);
          setSelectedIndex(null);
          setShowGame(true);

          // Now the effect that triggers game over will run if necessary
          newDescriptors = [];
        }
      }

      return newDescriptors;
    });
  };

  const handleSliderSubmit = () => {
    // Calculate results and proceed to next pair
    let updatedRankings = { ...rankings };
    const selectedTech = selectedCard[0].title;
    const unselectedTech = selectedCard[1].title;

    // Update wins, losses, and opponents
    updatedRankings[selectedTech].wins += 1;
    updatedRankings[unselectedTech].losses += 1;
    updatedRankings[selectedTech].opponents[unselectedTech] =
      (updatedRankings[selectedTech].opponents[unselectedTech] || 0) + 1;
    updatedRankings[unselectedTech].opponents[selectedTech] =
      (updatedRankings[unselectedTech].opponents[selectedTech] || 0) - 1;

    // Update the descriptors
    // updatedRankings[selectedTech].descriptors.push(...newDescriptors);

    setRankings(updatedRankings);
    setSelectedDescriptors([]);
    // setSelectedCard(null);
    // setUnselectedCard(null);
    // setCurrentPairIndex(currentPairIndex + 1);
    setDescriptorStage("firstDescriptors"); // Reset the descriptor stage
    setSelectionMade(false);
    setSelectedIndex(null);

    // Now the effect that triggers game over will run if necessary
    // newDescriptors = [];

    // Finding the true percentage for the selected card
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
    } else {
      // handle error case where foundComparison is undefined
      console.error(
        "Comparison not found for the selected and unselected cards."
      );
      return;
    }

    // Update wins, losses, and opponents based on sliderValue
    // ...

    // Update the score based on the distance from the sliderValue to the true percent

    const distance = Math.abs(truePercent - sliderPercent);
    console.log(truePercent, sliderPercent, distance);

    setScore((prevScore) => prevScore + (100 - distance));

    // Reset states for the next round
    // ...

    setDisplaySlider(false);
  };

  const handleSkip = () => {
    let updatedRankings = { ...rankings };
    const firstTech = shuffledTechnologies[currentPairIndex][0].title;
    const secondTech = shuffledTechnologies[currentPairIndex][1].title;

    // Update ties and opponents
    updatedRankings[firstTech].ties += 1;
    updatedRankings[secondTech].ties += 1;
    updatedRankings[firstTech].opponents[secondTech] =
      updatedRankings[firstTech].opponents[secondTech] || 0;
    updatedRankings[secondTech].opponents[firstTech] =
      updatedRankings[secondTech].opponents[firstTech] || 0;
    setScoreIndex((scoreIndex) => scoreIndex + 1);

    setRankings(updatedRankings);
    setSelectedDescriptors([]);
    setSelectedCard(null);
    setUnselectedCard(null);
    setCurrentPairIndex(currentPairIndex + 1);
    setDescriptorStage("firstDescriptors"); // Reset the descriptor stage
    setSelectionMade(false);
  };

  return (
    <div className="pairwise-game">
      <div className="progress-bar">
        <div
          className="progress-bar-inner"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {/* <ScoreLine userScore={score} stage={scoreIndex} /> */}

      {!gameOver && (
        <>
          <h2>
            Which technology do you consider safer? Facial recognition to ...
          </h2>

          <div className="technology-pair">
            {currentPairIndex < shuffledTechnologies.length && (
              <>
                {renderTechnologyCard(0)}
                {renderTechnologyCard(1)}
              </>
            )}
          </div>
          {selectedCard !== null && !showGame && (
            <div
              className="descriptors"
              style={{ position: "relative", top: "1em" }}
            >
              <h3>How would you describe this card in 2 words?</h3>
              <div className="selected-card-descriptors">
                <div className="bad-descriptors">
                  <div role="img" aria-label="sad-face">
                    😔
                  </div>
                  {descriptors[descriptorStage]
                    .slice(0, 5)
                    .map((descriptor, idx) => (
                      <Button
                        key={idx}
                        text={descriptor}
                        onClick={() => handleDescriptorSelection(descriptor)}
                        className={
                          selectedDescriptors.includes(descriptor)
                            ? "descriptor-button selected"
                            : "descriptor-button"
                        }
                      />
                    ))}
                </div>
                <div className="good-descriptors">
                  <div role="img" aria-label="happy-face">
                    😄
                  </div>
                  {descriptors[descriptorStage]
                    .slice(5)
                    .map((descriptor, idx) => (
                      <Button
                        key={idx}
                        text={descriptor}
                        onClick={() => handleDescriptorSelection(descriptor)}
                        className={
                          selectedDescriptors.includes(descriptor)
                            ? "descriptor-button selected"
                            : "descriptor-button"
                        }
                      />
                    ))}
                </div>
              </div>
            </div>
          )}
          {selectedCard !== null && showGame && (
            <div className="slider-div">
              <SliderComponent
                onSliderSubmit={handleSliderSubmit}
                setScoreIndex={setScoreIndex}
                setSliderPercent={setSliderPercent}
                selectedCard={selectedCard}
                setShowGame={setShowGame}
              />
            </div>
          )}

          {selectedCard == null && <Button text="Skip" onClick={handleSkip} />}
        </>
      )}

      {TwoScoreLine({
        userScore: score,
        stage: scoreIndex,
        selectedPercent: selectedPercent,
        unselectedPercent: unselectedPercent,
        sliderPercent: sliderPercent,
      })}

      {gameOver && <Rankings rankings={rankings} finishGame={finishGame} />}
    </div>
  );
};

export default PairwiseGame;
