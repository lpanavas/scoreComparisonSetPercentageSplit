import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./styles/TwoScoreLine.css";

const data = {
  0: { low_score: 0, average_score: 0, high_score: 49 },
  1: { low_score: 0, average_score: 87, high_score: 100 },
  2: { low_score: 0, average_score: 176, high_score: 200 },
  3: { low_score: 0, average_score: 258, high_score: 300 },
  4: { low_score: 0, average_score: 342, high_score: 391 },
  5: { low_score: 0, average_score: 429, high_score: 486 },
  6: { low_score: 0, average_score: 513, high_score: 579 },
};

const maxHighScore = 513; // Game finishes when the score reaches 102

function TwoScoreLine({
  userScore,
  stage,
  onFinish,
  selectedPercent,
  sliderPercent,
}) {
  const ref = useRef();
  const [finishedGame, setFinishedGame] = useState(false);
  const [previousScore, setPreviousScore] = useState(userScore);
  const [scoreChangeMsg, setScoreChangeMsg] = useState(null);
  const [userScores, setUserScores] = useState([userScore]);
  const [averageScores, setAverageScores] = useState([
    data[stage].average_score,
  ]);

  useEffect(() => {
    if (userScore !== previousScore) {
      const diff = userScore - previousScore;
      // setScoreChangeMsg(
      //   `${selectedPercent}% of people think the technology was safer. Your score increased by 100 - |${sliderPercent} - ${selectedPercent}| = ${diff}`
      // );
      setUserScores((userScores) => [...userScores, userScore]);
      setPreviousScore(userScore);
    }
  }, [userScore, selectedPercent, sliderPercent]);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const svgWidth = +svg.node().getBoundingClientRect().width;
    const xScale = d3
      .scaleLinear()
      .domain([0, maxHighScore])
      .range([0, svgWidth]);
    const score = data[stage];

    // Background lines and labels
    const lineInfo = [
      { y: 100, class: "user", color: "green", label: "You", score: userScore },
      {
        y: 170,
        class: "avg",
        color: "black",
        label: "Others",
        score: score.average_score,
      },
    ];

    lineInfo.forEach((line) => {
      if (svg.select(`.${line.class}-bg-line`).empty()) {
        // Background line
        svg
          .append("line")
          .attr("class", `${line.class}-bg-line`)
          .attr("x1", xScale(0))
          .attr("x2", xScale(maxHighScore))
          .attr("y1", line.y)
          .attr("y2", line.y)
          .attr("stroke", "#ddd")
          .attr("stroke-width", 2);

        // Label
        svg
          .append("text")
          .attr("class", `${line.class}-label`)
          .attr("x", 0)
          .attr("y", line.y)
          .attr("dy", "-1em")
          .text(line.label);

        // Tick mark
        svg
          .append("circle")
          .attr("class", `${line.class}-tick`)
          .attr("cx", xScale(line.score))
          .attr("cy", line.y)
          .attr("r", 5)
          .attr("fill", line.color);

        // Tick text
        svg
          .append("text")
          .attr("class", `${line.class}-tick-text`)
          .attr("x", xScale(line.score))
          .attr("y", line.y)
          .attr("dx", "1em")
          .attr("dy", "1em")
          .text(line.score);
      }
    });

    svg
      .selectAll(".user-score-history")
      .data(userScores)
      .enter()
      .append("circle")
      .attr("class", "user-score-history")
      .attr("cx", (d) => xScale(Math.min(d, maxHighScore)))
      .attr("cy", 100)
      .attr("r", 2)
      .attr("fill", "green");

    svg
      .selectAll(".avg-score-history")
      .data(averageScores)
      .enter()
      .append("circle")
      .attr("class", "avg-score-history")
      .attr("cx", (d) => xScale(Math.min(d, maxHighScore)))
      .attr("cy", 170)
      .attr("r", 2)
      .attr("fill", "black");

    // Update elements
    svg
      .selectAll(".user-tick")
      .data([userScore])
      .transition()
      .duration(1000)
      .attr("cx", (d) => xScale(Math.min(d, maxHighScore)));

    svg
      .selectAll(".avg-tick")
      .data([score.average_score])
      .transition()
      .duration(1000)
      .attr("cx", (d) => xScale(Math.min(d, maxHighScore)));

    svg
      .selectAll(".user-tick-text")
      .data([userScore])
      .transition()
      .duration(1000)
      .attr("x", (d) => xScale(Math.min(d, maxHighScore)))
      .text((d) => d);

    svg
      .selectAll(".avg-tick-text")
      .data([score.average_score])
      .transition()
      .duration(1000)
      .attr("x", (d) => xScale(Math.min(d, maxHighScore)))
      .text((d) => d);

    // Check if game is finished
    if (
      (userScore >= maxHighScore || score.average_score >= maxHighScore) &&
      !finishedGame
    ) {
      setAverageScores((averageScores) => [
        ...averageScores,
        score.average_score,
      ]);
      setFinishedGame(true);
      onFinish?.();
    } else if (
      score.average_score !== averageScores[averageScores.length - 1]
    ) {
      setAverageScores((averageScores) => [
        ...averageScores,
        score.average_score,
      ]);
    }
  }, [userScore, stage, finishedGame, onFinish, selectedPercent]);

  return (
    <div className="scoreLines">
      <svg className="scoreSvg" ref={ref} />
    </div>
  );
}

export default TwoScoreLine;
