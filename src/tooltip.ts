import { select, selectAll } from "d3";
import { format as SSF } from "ssf"

const yPadding = 15
const xPadding = 5

export function initTooltip(fontSize) {
  selectAll("#tooltip").remove();
  select("#vis")
    .insert("div", ":first-child")
    .attr("id", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "rgba(0, 0, 0, 0.75)")
    .style("border-color", "rgba(0, 0, 0, 0.75)")
    .style("border-radius", "5px")
    .style("width", "auto")
    .style("text-align", "left")
    .style("padding", "5px")
    .style("color", "#FFFFFF")
    .style("font-size", fontSize + "px")
}

export function linkTooltip(d: any, event: MouseEvent, dragging: boolean, measure: any, valFormat: string) {
  if (!dragging) {
    let { pageX, pageY } = event;
    let html = `Source: <b>${d.source.id}</b>`

    if(d.source.id !== d.target.id) {
      html += `<br/ >Target: <b>${d.target.id}</b> `
    }
    if(measure) {
      html += `<br>${measure.label_short || measure.label}: <b>${SSF(valFormat, d.value)}</b>`
    }

    select("#tooltip")
      .style("left", pageX - 20 + "px")
      .style("top", pageY - yOffset() + "px")
      .style("opacity", 1)
      .html(html)
  }
}

export function nodeTooltip(d: any, event: MouseEvent, dragging: boolean) {
  if (!dragging) {
    let { pageX, pageY } = event;
    let html = `${d.nodeField}: <b>${d.id}</b>`
    if(d.id !== d.group) {
      html += `<br/>${d.groupField}: <b>${d.group}</b>`
    }
    select("#tooltip")
      .style("left", pageX - 15 + "px")
      .style("top", pageY - yOffset() + "px")
      .html(html)
      .style("opacity", 1);
  }
}

export function updatePosition(d: any, event: MouseEvent, dragging: boolean, type: string) {
  if (!dragging) {
    let { pageX, pageY } = event;
    select("#tooltip")
      .style("left", pageX - xPadding + "px")
      .style("top", pageY - yOffset() + "px");
  }
}

function _clear(onHoverLabels, focus) {
  if (focus) {
    selectAll("line").attr("opacity", 0.1)
    selectAll("circle").attr("opacity", 0.2)
    selectAll("text").attr("opacity", !onHoverLabels ? 0.2 : 0)
  }
}

export function highlightNeighbors(d: any, event: MouseEvent, dragging: boolean, onHoverLabels: boolean, focus: boolean) {
  if(!dragging) {
    _clear(onHoverLabels, focus);
    let link_target = selectAll(`line[target="${d.id}"]`)
    let link_source = selectAll(`line[source="${d.id}"]`)
    link_target.attr("opacity", 1)
    link_source.attr("opacity", 1)
    select(`circle[id="${d.id}"]`).attr("opacity", 1);
    select(`text[id="${d.id}"]`).attr("opacity", 1);
    link_target.each((e: any) => {
      select(`circle[id="${e.source.id}"]`).attr("opacity", 1);
      select(`text[id="${e.source.id}"]`).attr("opacity", 1);
    })
    link_source.each((e: any) => {
      select(`circle[id="${e.target.id}"]`).attr("opacity", 1);
      select(`text[id="${e.target.id}"]`).attr("opacity", 1);
    })
  }
}

export function hideTooltip() {
  select("#tooltip").style("opacity", 0).style("left", 0);
}

export function clearHighlight(onHoverLabels) {
  selectAll("line").attr("opacity", 1)
  selectAll("circle").attr("opacity", 1)
  selectAll("text").attr("opacity", onHoverLabels ? 0 : 1)
}

function yOffset() {
  return parseInt(select("#tooltip").style("height"), 10) + yPadding
}