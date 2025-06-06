import { useRef, useEffect } from 'react';
import { normalizeStat, allStatLabelsShort, allStatLabels } from '../../utils/constants';
import * as d3 from 'd3';


const WaterfallChart = ({ importance, homeStats, awayStats, dimensions }) => {



  function calculateModelScore(importance, homeStats, awayStats) {
    const statKeys = Object.keys(homeStats).filter((stat) => stat !== 'awayWinLoss'); // assumes same keys in both
    console.log(statKeys)
    const contributions = statKeys.map((key, i) => {
      let diff;

      if (key === 'seasonWinLoss') {
        const homeWins = parseInt(homeStats.seasonWinLoss.split('-')[0], 10);
        const awayWins = parseInt(awayStats.seasonWinLoss.split('-')[0], 10);
        diff = normalizeStat(key, homeWins) - normalizeStat(key, awayWins);
      } else if (key === 'homeWinLoss') {
        const homeWins = parseInt(homeStats.homeWinLoss.split('-')[0], 10);
        const awayWins = parseInt(awayStats.awayWinLoss.split('-')[0], 10); // note: asymmetry?
        diff = normalizeStat('homeWinLoss', homeWins) - normalizeStat('awayWinLoss', awayWins);
      } else {
        diff = normalizeStat(key, homeStats[key]) - normalizeStat(key, awayStats[key]);
      }
      return importance[i] * diff;
    });

    const totalScore = contributions.reduce((sum, val) => sum + val, 0);
    const totalAbs = contributions.reduce((sum, val) => sum + Math.abs(val), 0);
    console.log(contributions)
    const percentInfluence = totalAbs === 0
      ? contributions.map(() => 0)
      : contributions.map(c => (c / totalAbs) * 100);

    return {
      totalScore,
      contributions,
      totalAbs,
      percentInfluence
    };
  }


  const { totalScore, contributions, totalAbs, percentInfluence } = calculateModelScore(importance, homeStats, awayStats);
  // Extract stat keys
  const statKeys = Object.keys(homeStats);

  console.log("Total Model Score:", totalScore);
  console.log("Individual Contributions:", contributions);
  console.log("Total Absolute Contribution:", totalAbs);
  console.log("Percent Influence:", percentInfluence);

  const svgRef = useRef();

  useEffect(() => {
    const { width, height } = dimensions || { width: 0, height: 0 };
    const data = percentInfluence.map((value, index) => ({ index, value }));

    let cumulative = 0;
    const waterfallData = data.map(d => {
      const start = cumulative;
      cumulative += d.value;
      const end = cumulative;
      return {
        ...d,
        start,
        end,
        positive: d.value >= 0,
      };
    });

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous renders

    const chart = svg
      .attr('width', width)
      .attr('height', height)
      .append("g");

    const x = d3.scaleBand()
      .domain(waterfallData.map(d => d.index))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([
        d3.min(waterfallData, d => Math.min(d.start, d.end)),
        d3.max(waterfallData, d => Math.max(d.start, d.end))
      ])
      .nice()
      .range([height, 0]);

      
    // Create a group for grid lines
    chart.append("g")
      .attr("class", "grid")
      .call(
        d3.axisLeft(y)
          .tickSize(-width) // Full-width horizontal lines
          .tickFormat('')   // No tick labels, just lines
      )
      .selectAll("line")
      .attr("stroke", "white") // Light gray color for grid lines
      .attr("stroke-dasharray", "2,2"); // Optional: dashed lines

    // Tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("padding", "6px 10px")
      .style("background", "#fff")
      .style("border", "1px solid #ccc")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("font-size", "0.75rem");

    // Bars
    chart.selectAll(".bar")
      .data(waterfallData)
      .enter()
      .append("rect")
      .attr("x", d => x(d.index))
      .attr("y", d => y(Math.max(d.start, d.end)))
      .attr("height", d => Math.abs(y(d.start) - y(d.end)))
      .attr("width", x.bandwidth())
      .attr("fill", d => d.positive ? "#4CAF50" : "#F44336")
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        console.log(d)
        tooltip
          .html(`${allStatLabels[statKeys[d.index]]} ${d.positive === true ? '+' : '-'}${Math.abs(d.value.toFixed(2))}%` || `Stat ${d.index}`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(300).style("opacity", 0);
      });
    // Clean up tooltip on unmount
    return () => tooltip.remove();

  }, [contributions, dimensions, percentInfluence, statKeys]);


  return <svg ref={svgRef}></svg>;
};

export default WaterfallChart;