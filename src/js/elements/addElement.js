/**
 * Add an element
 * note: jointjs is its own id to track the element
 * for undo/redo purpose, we need to keep track of added-deleted item with a boxId
 * (in jointjs a deleted-recreated element is not the same)
 */

import "select2";
import * as joint from "jointjs";
import { paper, graph } from "../layout/interface";
import { webservices, getLayoutOptions } from "../constants/globals";
import {
  THEME,
  BOX_TITLE_HTML_TAG,
  ICON_COL,
  TITLE_COL
} from "../constants/constants";
import {
  isParamInput,
  isPortUserdefined,
  computeBoxWidth,
  computeBoxHeight,
  computeTitleLength,
  generateUniqueId,
  getElementByBoxId
} from "../layout/utils";
import { setParametersInForeignObject, createPort } from "../layout/inputs";
import {
  PORT_SELECTOR,
  TITLE_ROW_CLASS,
  BOX_CONTAINER_CLASS,
  FOREIGN_CLASS,
  IN_PORT_CLASS,
  OUT_PORT_CLASS
} from "../constants/selectors";

const createBox = (e, { position, size, boxId }) => {
  const {
    category,
    label,
    ports: { items },
    description,
    params
  } = e;
  const { titleHeight } = computeTitleLength(e);

  const template = `<g class="scalable"><rect></rect></g>
      <foreignObject class="${FOREIGN_CLASS}" x="0" 
      y="-${titleHeight}" width="${size.width}" height="${size.height +
    titleHeight}">
      <body xmlns="http://www.w3.org/1999/xhtml">
      <div class="${BOX_CONTAINER_CLASS} no-gutters p-0">
      <div class="${TITLE_ROW_CLASS} ${category} row justify-content-start" style="height:${titleHeight}px">
      <div class="${ICON_COL} icon"></div>
      <${BOX_TITLE_HTML_TAG} class="${TITLE_COL} align-middle">${label}</${BOX_TITLE_HTML_TAG}>
      </div>
      </div>
      </body>
      </foreignObject>`;

  const Box = joint.shapes.basic.Rect.define(label, {
    markup: template,
    attrs: {
      root: {
        magnet: false
      },
      body: THEME.body,
      rect: { ...THEME.rect, ...size }
    },
    boxId,
    position,
    size,
    ports: {
      groups: THEME.groups,
      items
    },
    description,
    originalParams: params,
    defaultParams: {},
    portMarkup: [{ tagName: "circle", selector: PORT_SELECTOR }],

    getGroupPorts: function(model, group) {
      return model.getPorts().filter(port => {
        return port.group === group;
      });
    },

    getInPorts: function(model) {
      return this.getGroupPorts(model, IN_PORT_CLASS);
    },

    getUsedInPorts: function() {
      const graph = this.graph;
      if (!graph) return [];
      const connectedLinks = graph.getConnectedLinks(this, { inbound: true });
      return connectedLinks.map(link => {
        return this.getPort(link.target().port);
      });
    }
  });

  const element = new Box();
  element.addTo(graph);
  return element;
};

const transformWebserviceForGraph = (webservice, category) => {
  if (!webservice.name) {
    alert("problem with ", webservice);
    return {};
  }
  const { name: label, description, outputs, inputs } = webservice;

  // handle ports
  const ports = { items: [] };
  inputs
    .filter(inp => isPortUserdefined(inp))
    .forEach(inp => {
      const port = createPort(inp, IN_PORT_CLASS);
      if (port.group) {
        ports.items.push(port);
      }
    });
  outputs.forEach(out => {
    const port = createPort(out, OUT_PORT_CLASS);
    if (port.group) {
      ports.items.push(port);
    }
  });

  // handle params
  const params = inputs.filter(inp => isParamInput(inp));

  const ret = {
    name,
    description,
    label,
    params,
    ports,
    category
  };
  return ret;
};

// Create a custom element.
// ------------------------
const addElementFromTransformedJSON = (e, parameters) => {
  const { label } = e;

  if (!label) {
    return;
  }

  const { boxId = generateUniqueId() } = parameters;

  const element = createBox(e, { ...parameters, boxId });

  setParametersInForeignObject(element, e, parameters.params);

  return element;
};

// helper function to find an empty position to add
// an element without overlapping other ones
// it tries to fill the canvas view first horizontally
// then vertically
const findEmptyPosition = size => {
  const bcr = paper.svg.getBoundingClientRect();
  const canvasDimensions = paper.clientToLocalRect({
    x: bcr.left,
    y: bcr.top,
    width: bcr.width,
    height: bcr.height
  });

  const position = { x: canvasDimensions.x + 100, y: canvasDimensions.y + 100 };

  while (
    graph.findModelsInArea({
      ...position,
      width: size.width + 100,
      height: size.height + 100
    }).length
  ) {
    position.x += size.width + 100;
    if (canvasDimensions.x + canvasDimensions.width < position.x + size.width) {
      position.x = canvasDimensions.x + 100;
      position.y += size.height + 100;
    }
  }

  return position;
};

export const addElementToGraphFromServiceDescription = (
  webservice,
  defaultParams = {}
) => {
  const transformedWebservice = transformWebserviceForGraph(
    webservice,
    webservice.type
  );

  const { showParameters } = getLayoutOptions();

  const size = {
    width: computeBoxWidth(transformedWebservice, showParameters),
    height: computeBoxHeight(transformedWebservice, showParameters)
  };

  let { position, params, boxId } = defaultParams;
  if (!position) {
    // avoid adding overlapping elements
    position = findEmptyPosition(size);
  }

  const element = addElementFromTransformedJSON(transformedWebservice, {
    position,
    size,
    params,
    boxId
  });

  return element;
};

// add element given a name. It will then retrieve the webservice
// info from the services xml descriptions
// returns boxId and position for undo-redo purpose
export const addElementByName = (name, defaultParams = {}) => {
  const algo = webservices.filter(service => service.name == name);
  if (algo.length) {
    const e = addElementToGraphFromServiceDescription(algo[0], defaultParams);
    const { boxId, position } = e.attributes;

    return { boxId, position };
  } else {
    console.error(`${name} doesnt exist`);
  }
};

const addElementByCellView = (cellView, boxId) => {
  const { defaultParams, size } = cellView.model.attributes;

  const e = graph.getCell(cellView.model.id).clone();
  let id;
  if (boxId) {
    e.attributes.boxId = boxId;
    id = boxId;
  } else {
    id = e.attributes.boxId;
  }
  // avoid cloning overlap
  e.attributes.position = findEmptyPosition(size);

  e.addTo(graph);
  setParametersInForeignObject(e, defaultParams);
  return { e, id };
};

// return for undo purpose
export const addElementsByCellView = (elements, ids) => {
  const addedElements = [];
  const boxIds = [];
  for (const [i, el] of elements.entries()) {
    const boxId = ids ? ids[i] : undefined;
    const { e, id } = addElementByCellView(el, boxId);
    addedElements.push(e);
    boxIds.push(id);
  }
  return { addedElements, boxIds };
};

// return for undo purpose
const restoreElement = element => {
  element.addTo(graph);
  setParametersInForeignObject(element);
};

export const restoreElements = elements => {
  for (const el of elements) {
    restoreElement(el);
  }
  return { elements };
};

/*ADD LINKS*/

export const addLinkFromJSON = link => {
  const linkEl = new joint.shapes.standard.Link(link);
  linkEl.addTo(graph);
  return { link: linkEl };
};

export const addLinkBySourceTarget = ({
  sourceBoxId,
  targetBoxId,
  sPortName,
  tPortName
}) => {
  const s = getElementByBoxId(sourceBoxId);
  const sPort = s.getPorts().filter(p => p.name == sPortName)[0].id;
  const t = getElementByBoxId(targetBoxId);
  const tPort = t.getPorts().filter(p => p.name == tPortName)[0].id;

  const link = {
    source: { id: s.id, port: sPort },
    target: { id: t.id, port: tPort }
  };

  return addLinkFromJSON(link);
};