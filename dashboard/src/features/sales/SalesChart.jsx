import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSalesData, setRange } from './salesSlice';

const SalesChart = () => {
  const dispatch = useDispatch();
  const { data, status, currentRange } = useSelector((state) => state.sales);
  
  const svgRef = useRef();
  const containerRef = useRef();
  
  // Local state for tooltip
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: null });

  // Dimensions
  const width = 600;
  const height = 300;
  const margin = { top: 20, right: 30, bottom: 30, left: 50 };

  // --- 1. INITIAL LOAD & STRUCTURE ---
  useEffect(() => {
    dispatch(fetchSalesData(currentRange));
    
    // Setup the SVG structure strictly once
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear mostly for HMR/Dev safety

    // X-Axis Group
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`);

    // Y-Axis Group
    svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`);

    // The Line Path
    svg.append("path")
      .attr("class", "line-path")
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2);

    // Interaction Overlay (for tooltip)
    // We create the rect but attach events in the Update phase
    svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all");

    // Focus Circle (Visual cursor)
    const focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");
      
    focus.append("circle")
      .attr("r", 5)
      .attr("fill", "#fff")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2);

  }, []); // Run once on mount

  // --- 2. HANDLE FILTER CHANGE ---
  const handleRangeChange = (range) => {
    dispatch(setRange(range));
    dispatch(fetchSalesData(range));
  };

  // --- 3. DATA UPDATE & TRANSITION ---
  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);

    // -- Scales --
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.date)))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) * 1.1]) // Add 10% headroom
      .range([height - margin.bottom, margin.top]);

    // -- Animate Axes --
    svg.select(".x-axis")
      .transition().duration(750)
      .call(d3.axisBottom(x).ticks(6));

    svg.select(".y-axis")
      .transition().duration(750)
      .call(d3.axisLeft(y));

    // -- Animate Line --
    const lineGenerator = d3.line()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.select(".line-path")
      .datum(data)
      .transition().duration(750)
      .attr("d", lineGenerator);

    // -- Re-attach Interaction Logic (to use new scales) --
    const bisectDate = d3.bisector(d => new Date(d.date)).left;
    const focus = svg.select(".focus");

    svg.select(".overlay")
      .on("mouseover", () => focus.style("display", null))
      .on("mouseout", () => {
        focus.style("display", "none");
        setTooltip(prev => ({ ...prev, visible: false }));
      })
      .on("mousemove", (event) => {
        const x0 = x.invert(d3.pointer(event)[0]);
        const i = bisectDate(data, x0, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        let d = d0;
        if (d1 && d0) {
          d = x0 - new Date(d0.date) > new Date(d1.date) - x0 ? d1 : d0;
        }

        if (d) {
          focus.attr("transform", `translate(${x(new Date(d.date))},${y(d.value)})`);
          setTooltip({
            visible: true,
            x: x(new Date(d.date)) + 20,
            y: y(d.value) - 10,
            content: d
          });
        }
      });

  }, [data]); // Run whenever data changes

  return (
    <div ref={containerRef} className="chart-container" style={{ position: 'relative', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      
      {/* Header with Filter Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#1e293b' }}>Revenue Trends</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => handleRangeChange('30_days')}
            style={{ 
              padding: '6px 12px', 
              borderRadius: '4px', 
              border: 'none', 
              cursor: 'pointer',
              background: currentRange === '30_days' ? '#3b82f6' : '#e2e8f0',
              color: currentRange === '30_days' ? '#fff' : '#64748b'
            }}
          >
            Last 30 Days
          </button>
          <button 
            onClick={() => handleRangeChange('ytd')}
            style={{ 
              padding: '6px 12px', 
              borderRadius: '4px', 
              border: 'none', 
              cursor: 'pointer',
              background: currentRange === 'ytd' ? '#3b82f6' : '#e2e8f0',
              color: currentRange === 'ytd' ? '#fff' : '#64748b'
            }}
          >
            Year to Date
          </button>
        </div>
      </div>

      {status === 'loading' && <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#64748b'}}>Updating...</div>}
      
      {/* The Chart SVG */}
      <svg ref={svgRef} width={600} height={300} style={{ overflow: 'visible', opacity: status === 'loading' ? 0.5 : 1, transition: 'opacity 0.2s' }}></svg>

      {/* Tooltip */}
      {tooltip.visible && tooltip.content && (
        <div style={{
            position: 'absolute',
            left: tooltip.x,
            top: tooltip.y,
            pointerEvents: 'none',
            background: 'rgba(30, 41, 59, 0.9)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            transform: 'translateY(-100%)',
            zIndex: 10
          }}>
          <strong>{tooltip.content.date}</strong>
          <div>${tooltip.content.value}</div>
        </div>
      )}
    </div>
  );
};

export default SalesChart;