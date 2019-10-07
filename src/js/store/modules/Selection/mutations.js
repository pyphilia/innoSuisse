import { BOX_HIGHLIGHTER } from "../../../constants/constants";

export function highlightSelection(cellView) {
  // console.log("TCL: highlightSelection -> cellView", cellView)
  if (cellView) {
    cellView.highlight(null, BOX_HIGHLIGHTER);
  }
}
// function highlightAllCellViews(elements) {
//   for (const el of elements) {
//     highlightSelection(el);
//   }
// }
export function unHighlight(cellView) {
  cellView.unhighlight(null, BOX_HIGHLIGHTER);
}
export function unHighlightAllElements(elements) {
  // console.log("TCL: unHighlightAllElements -> unHighlightAllElements", elements)
  // do not use unHighlightSelection to remove the array once
  for (const el of elements) {
    unHighlight(el);
  }
}

export default {
  addCellViewToSelection(state, cellView) {
    if (state.selectedElements.indexOf(cellView) == -1) {
      state.selectedElements.push(cellView);
    }
    state.highlightSelection(state, cellView);
    // saveElementsPositionFromCellView(state.selectedElements);
  },
  addCellViewsToSelection(state, cellViews) {
    for (const cellView of cellViews) {
      state.highlightSelection(cellView);
      state.addCellViewToSelection(cellView);
    }
    // saveElementsPositionFromCellView(state.selectedElements);
  },
  removeElementFromSelection(state, cellView, index) {
    if (!index) {
      index = state.selectedElements.indexOf(cellView);
    }
    state.selectedElements.splice(index, 1);
    state.unHighlight(cellView);
  },
  toggleCellViewInSelection(state, cellView) {
    const index = state.selectedElements.indexOf(cellView);
    if (index == -1) {
      state.addCellViewToSelection(cellView);
    } else {
      state.removeElementFromSelection(cellView, index);
    }
  },
  resetHighlight(state) {
    if (state.selectedElements.length) {
      state.unHighlightAllSelected();
      state.highlightAllSelected();
    }
  }
};
