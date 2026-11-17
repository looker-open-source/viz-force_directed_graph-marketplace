// © 2020 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import * as d3 from "d3";

import { VisConfig, VisQueryResponse, VisualizationDefinition } from "./types";

export const formatType = (valueFormat: string) => {
  if (!valueFormat) return undefined;
  let format = "";
  switch (valueFormat.charAt(0)) {
    case "$":
      format += "$";
      break;
    case "£":
      format += "£";
      break;
    case "€":
      format += "€";
      break;
  }
  if (valueFormat.indexOf(",") > -1) {
    format += ",";
  }
  const splitValueFormat = valueFormat.split(".");
  format += ".";
  format += splitValueFormat.length > 1 ? splitValueFormat[1].length : 0;

  switch (valueFormat.slice(-1)) {
    case "%":
      format += "%";
      break;
    case "0":
      format += "f";
      break;
  }
  return d3.format(format);
};

export const handleErrors = (
  vis: VisualizationDefinition,
  res: VisQueryResponse,
  options: VisConfig
) => {
  const check = (
    group: string,
    noun: string,
    count: number,
    min: number,
    max: number
  ): boolean => {
    if (!vis.addError || !vis.clearErrors) return false;
    if (count < min) {
      vis.addError({
        title: `Not Enough ${noun}s`,
        message: `This visualization requires ${
          min === max ? "exactly" : "at least"
        } ${min} ${noun.toLowerCase()}${min === 1 ? "" : "s"}.`,
        group,
      });
      return false;
    }
    if (count > max) {
      vis.addError({
        title: `Too Many ${noun}s`,
        message: `This visualization requires ${
          min === max ? "exactly" : "no more than"
        } ${max} ${noun.toLowerCase()}${min === 1 ? "" : "s"}.`,
        group,
      });
      return false;
    }
    vis.clearErrors(group);
    return true;
  };

  const { pivots, dimensions, measure_like: measures } = res.fields;

  return (
    check(
      "pivot-req",
      "Pivot",
      pivots.length,
      options.min_pivots,
      options.max_pivots
    ) &&
    check(
      "dim-req",
      "Dimension",
      dimensions.length,
      options.min_dimensions,
      options.max_dimensions
    ) &&
    check(
      "mes-req",
      "Measure",
      measures.length,
      options.min_measures,
      options.max_measures
    )
  );
};

const splitTopLevelCommas = (value: string): string[] => {
  const parts: string[] = [];
  let current = "";
  let parenDepth = 0;

  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    if (ch === "(") {
      parenDepth++;
      current += ch;
    } else if (ch === ")") {
      if (parenDepth > 0) {
        parenDepth--;
      }
      current += ch;
    } else if (ch === "," && parenDepth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  parts.push(current);
  return parts;
};

export const parseColorRange = (colorRange: unknown): string[] => {
  if (colorRange == null) {
    return [];
  }

  const rawEntries = Array.isArray(colorRange)
    ? colorRange
    : typeof colorRange === "string"
    ? [colorRange]
    : [];

  const colors: string[] = [];
  rawEntries.forEach((entry) => {
    if (typeof entry !== "string") {
      return;
    }
    splitTopLevelCommas(entry).forEach((token) => {
      const trimmed = token.trim();
      const unquoted = trimmed.replace(/^(['"])(.*)\1$/, "$2").trim();
      if (unquoted) {
        colors.push(unquoted);
      }
    });
  });

  return colors;
};
