constant: VIS_ID {
  value: "force_directed_graph-marketplace"
  export: override_optional
}

constant: VIS_LABEL {
  value: "Force-Directed Graph"
  export: override_optional
}

visualization: {
  id: "@{VIS_ID}"
  label: "@{VIS_LABEL}"
  file: "forcedirected.js"
}
