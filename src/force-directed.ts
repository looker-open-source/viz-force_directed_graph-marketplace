import * as d3 from 'd3'
import { formatType, handleErrors } from './utils'

import {
  Row,
  Looker,
  VisualizationDefinition
} from './types'

// Global values provided via the API
declare var looker: Looker

interface ForceDirectedGraphVisualization extends VisualizationDefinition {
  svg?: any,
}

const vis: ForceDirectedGraphVisualization = {
  id: 'force-directed', // id/label not required, but nice for testing and keeping manifests in sync
  label: 'Force Directed Graph',
  options: {
    color_range: {
      type: 'array',
      label: 'Color Range',
      display: 'colors',
      default: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
    },
    link_color: {
      type: 'string',
      label: 'Link Color',
      default: ['black']
    },
    font_size: {
      type: 'string',
      label: 'Font Size',
      default: ['10px']
    },
    font_color: {
      type: 'string',
      label: 'Font Color',
      default: ['black']
    },
    font_weight: {
      type: 'string',
      label: 'Font Weight',
      default: ['normal']
    },
    circle_radius: {
      type: 'string',
      label: 'Circle Radius',
      default: 5
    },
    linkDistance: {
      type: 'string',
      label: 'Link Distance',
      default: 30
    },
    labels : {
      type: 'boolean',
      label: 'Show Labels',
      default: false
    },
    labelTypes: {
      type: 'string',
      label: 'Label Node Types',
      default: []
    }
  },
  // Set up the initial state of the visualization
  create(element, config) {
    element.style.fontFamily = `"Open Sans", "Helvetica", sans-serif`
    this.svg = d3.select(element).append('svg')
  },
  // Render in response to the data or settings changing
  update(data, element, config, queryResponse, details) {
    if (!handleErrors(this, queryResponse, {
      min_pivots: 0, max_pivots: 0,
      min_dimensions: 4, max_dimensions: 4,
      min_measures: 1, max_measures: 1
    })) return

    // Work around bug in Looker where sometimes it's called without config
    if (!config.color_range) {
       return;
    }

    this.svg.selectAll("*").remove();

    const height = element.clientHeight + 20
    const width = element.clientWidth

    var radius = 5
    if (config.circle_radius) {
        radius = config.circle_radius; 
    }

    var linkDistance = 30
    if (config.linkDistance) {
        linkDistance = config.linkDistance; 
    }

    const drag = simulation => {

       function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
       }
  
       function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
       }
  
       function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
       }
  
       return d3.drag()
         .on("start", dragstarted)
         .on("drag", dragged)
         .on("end", dragended);
    }

    const dimensions = queryResponse.fields.dimension_like
    const measure = queryResponse.fields.measure_like[0]
    const format = d3.format(",d")

    const colorScale = d3.scaleOrdinal()
    var color = colorScale.range(d3.schemeCategory10)
    if (config.color_range != null) {
        color = colorScale.range(config.color_range)
    }

    var nodes_unique = []
    var nodes = []
    var links = []

    // First make the nodes array
    data.forEach((row: Row) => {
       if (nodes_unique.indexOf(row[dimensions[0].name].value) == -1) {
	  nodes_unique.push(row[dimensions[0].name].value);
          const newnode = { id: row[dimensions[0].name].value, group: row[dimensions[1].name].value};
          nodes.push(newnode);
       }
       if (nodes_unique.indexOf(row[dimensions[2].name].value) == -1) {
	  nodes_unique.push(row[dimensions[2].name].value);
          const newnode = { id: row[dimensions[2].name].value, group: row[dimensions[3].name].value};
          nodes.push(newnode);
       }
       const newlink = { source: row[dimensions[0].name].value, target: row[dimensions[2].name].value, value: row[measure.name].value};
       links.push(newlink);
    })

    var manybody = d3.forceManyBody()
    //manybody.strength(-7)

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).distance(linkDistance).id(d => (d as any).id))
      .force("charge", manybody)
      .force("center", d3.forceCenter(width / 2, height / 2));

    const svg = this.svg!
      .attr("width", '100%')
      .attr("height", height )

    const link = svg.append("g")
      .attr("stroke", config.link_color)
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke-width", d => Math.sqrt(d.value));

    var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(drag(simulation));

    var circle = node.append("circle")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("r", radius)
      .attr("fill", d => color(d.group))

    var labelTypes = [];
    if (config.labelTypes && config.labelTypes.length) {
      labelTypes = config.labelTypes.split(',')
    }

    if (config.labelTypes && config.labelTypes.length) {
      node.append("text")
        .style("font-size", config.font_size)
        .style("fill", config.font_color)
        .attr("y", (-1 * config.circle_radius -3) + "px")
        .style("text-anchor", "middle")
        .style("font-weight", config.font_weight)
        .text(function(d) { 
          if (labelTypes.indexOf(d.group) > -1) {
             return d.id;
          } else {
              return null;
          }
        });

      node.append("title")
        .text(function(d) { 
          if (labelTypes.indexOf(d.group) == -1) {
             return d.id;
          } else {
             return null;
          }
        });
    } else if (config.labels) {
      node.append("text")
        .style("font-size", config.font_size)
        .style("fill", config.font_color)
        .attr("y", (-1 * config.circle_radius -3) + "px")
        .style("text-anchor", "middle")
        .style("font-weight", config.font_weight)
        .text(function(d) { return d.id; } 
        );
    } else {
      node.append("title")
        .text(function(d) { return d.id } 
        );
    }

    var initialized = false;

    simulation.on("tick", () => {
      link
        .attr("x1", d => { if (isNaN(d.source.x)) { return 0; } else { return d.source.x;}})
        .attr("y1", d => { if (isNaN(d.source.y)) { return 0; } else { return d.source.y;}})
        .attr("x2", d => { if (isNaN(d.target.x)) { return 0; } else { return d.target.x;}})
        .attr("y2", d => { if (isNaN(d.target.y)) { return 0; } else { return d.target.y;}});

      node
        .attr("cx", d => d.x = Math.max(radius, Math.min(width - radius, d.x)))
        .attr("cy", d => d.y = Math.max(radius, Math.min(height - radius, d.y)))
        .attr("transform", function(d) { if (isNaN(d.x)) { return ""; } else { return "translate(" + d.x + "," + d.y + ")"; }});
      });
   }
}

looker.plugins.visualizations.add(vis)
