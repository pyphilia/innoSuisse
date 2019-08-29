import { PORT_SELECTOR } from "./selectors";

export const DIVA_SERVICES_API_URL = "http://divaservices.unifr.ch/api/v2/";

export const categoryName = {
  binarization: "binarization",
  kws: "kws",
  imageprocessing: "image processing",
  evaluation: "evaluation",
  segmentation: "segmentation",
  enhancement: "enhancement",
  graph: "graph",
  ocr: "ocr",
  objectdetection: "object detection",
  activelearning: "active learning"
};

export const Inputs = {
  SELECT: { tag: "select", type: "select" },
  NUMBER: { tag: "input", type: "number" }
};
Object.freeze(Inputs);

export const TOOLTIP_OPTIONS = { html: true };
export const TOOLTIP_BREAK_LINE = "<br>";
export const TOOLTIP_HTML = `<span><i class="fas fa-info-circle"></i></span>`;
export const BOX_TITLE_HTML_TAG = "h3";

export const TOOLTIP_COL = "col-1";
export const NAME_COL = "col-5";
export const PARAM_COL = "col-4";
export const RESET_COL = "col-2";

export const TITLE_COL = "col-10";
export const TOOLTIP_BOX_COL = "col-2";

export const colorType = type => {
  switch (type) {
    case "folder":
      return "lightblue";
    case "image":
      return "orange";
    case "application":
      return "yellow";
    case "text":
      return "blue";
    default:
      return "red";
  }
};

export const THEME = {
  magnetAvailabilityHighlighter: {
    name: "stroke",
    options: {
      padding: 6,
      attrs: {
        "stroke-width": 3,
        stroke: "red"
      }
    }
  },
  body: {
    fill: "lightgray"
  },
  rect: {
    fill: "#eeeeee"
  },
  groups: {
    in: {
      position: { name: "left" },
      attrs: {
        [PORT_SELECTOR]: {
          magnet: "passive",
          r: 12,
          fill: "darkblue",
          stroke: "black"
        }
      },
      z: 5,
      label: {
        position: {
          name: "left"
        }
      }
    },
    out: {
      position: { name: "right" },
      attrs: {
        [PORT_SELECTOR]: {
          magnet: "active",
          r: 12,
          fill: "lightblue",
          stroke: "black"
        }
      },
      z: 5,
      label: {
        position: {
          name: "right",
          fill: "#123456",
          textAnchor: "middle"
        }
      }
    }
  }
};
