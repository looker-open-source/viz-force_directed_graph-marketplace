constant: vis_id {
  value: "force-directed-graph"
  export: override_optional
}

constant: vis_label {
  value: "Force-Directed Graph"
  export: override_optional
}

visualization: {
  id: "@{vis_id}"
  label: "@{vis_label}"
  file: "forcedirected.js"
  dependencies: []
}
