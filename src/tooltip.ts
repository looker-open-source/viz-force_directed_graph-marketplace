import { select, selectAll } from "d3";

export function initTooltip() {
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
    .style("color", "#FFFFFF");
}

export function linkTooltip(d: any, event: MouseEvent, dragging: boolean) {
  if (!dragging) {
    console.log(d)
    let { pageX, pageY } = event;
    select("#tooltip")
      .style("left", pageX - 20 + "px")
      .style("top", pageY - 100 + "px")
      .style("opacity", 1)
      .text("HELLO");
  }
}

export function nodeTooltip(d: any, event: MouseEvent, dragging: boolean) {
  if (!dragging) {
    console.log(d)
    let { pageX, pageY } = event;
    select("#tooltip")
      .style("left", pageX + 15 + "px")
      .style("top", pageY + 15 + "px")
      .html(`<b>${d.nodeField}</b>: ${d.id}`)
      .style("opacity", 1);
  }
}

export function updatePosition(d: any, event: MouseEvent, dragging: boolean) {
  if (!dragging) {
    let { pageX, pageY } = event;
    select("#tooltip")
      .style("left", pageX - 20 + "px")
      .style("top", pageY - 20 + "px");
  }
}

export function hideTooltip() {
  select("#tooltip").style("opacity", 0).style("left", 0);
}
