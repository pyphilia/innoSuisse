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

export const TOOLTIP_HTML = `<span>(i)</span>`;

export const colorType = type => {
  switch (type) {
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
    fill: "#2ECC71"
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
