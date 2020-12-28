<img src="assets/force-directed.svg" alt="thumbnail" width="200"/>

# Force-Directed Graph by [Hashpath](https://www.hashpath.com/)

### Originally created for Looker's Marketplace by [Hashpath](https://www.hashpath.com/) 

Use a force-directed graph to show relationships between entities in your data.

Nodes within the graph are mathematically clustered together based-on their relationship with other nodes. The weight of the link (line between nodes) is based on the magnitude of the relationship.

Force-directed graphs are particularly effective for visualizing how various entities (dimensions) are connected to each other.

This diagram requires 4 dimensions and 0-1 measures. It was built using the D3 visualization library.

* **Dimension 1**: node value 1
* **Dimension 2**: node value 1 group
* **Dimension 3**: node value 2
* **Dimension 3**: node value 2 group
* **Measure 1 (optional)**: value of relationship

The example below depicts all bike share stations in the Boston areas. When riders bike from one station to another it creates a link in the data. The colors represent the city where the bike station is located (Boston, Cambridge, Somerville).  The four dimensions returned in this example are:

* Departing station (dimension)
* Departing station city (dimension)
* Arriving station (dimension)
* Arriving station city (dimension)
* Total bike trips (measure)

![Force-Directed Graph](assets/force-directed-ex.gif)


### Interested in extending the visualization for your own use case?
#### Quickstart Dev Instructions
1.  **Install Dependecies.**

    Using yarn, install all dependencies
    ```
    yarn install
    ```
2. **Make changes to the source code**

3.  **Compile your code**

    You need to bundle your code, let's run:
    ```
    yarn build
    ```
    Recommended: Webpack can detect changes and build automatically
     ```
    yarn watch
    ```
    Your compiled code can be found in this directory.

**`./force-directed.js`**: This visualization's minified distribution file. 

**`manifest.lkml`**: Looker's external dependencies configuration file. The visualization object is defined here.

**`marketplace.json`**: A JSON file containing information the marketplace installer uses to set up this project.

**`/src`**: This directory will contain all of the visualization's source code.

**`/src/force-directed.ts`**: The main source code for the visualization.
