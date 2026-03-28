import { createComparison, defaultRules } from "../lib/compare.js";

let filteringRules = [
  ...defaultRules,
  "caseInsensitiveStringIncludes",
  "searchMultipleFields",
  "numericTolerance",
];

const compare = createComparison(filteringRules);

export function initFiltering(elements, indexes) {
  Object.keys(indexes).forEach((elementName) => {
    elements[elementName].append(
      ...Object.values(indexes[elementName]).map((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        return option;
      }),
    );
  });

  return (data, state, action) => {
    if (action?.type === "clear") {
      const button = action.submitter;
      const fieldName = button.dataset.field;
      const parent = button.parentElement;
      const input = parent.querySelector("input, select");

      if (input) {
        input.value = "";
        if (fieldName && state[fieldName] !== undefined) {
          state[fieldName] = "";
        }
      }
    }

    if (
      !state ||
      Object.keys(state).length === 0 ||
      Object.values(state).every((value) => !value)
    ) {
      return [...data];
    }

    const processedState = { ...state };

    if (processedState.totalFrom || processedState.totalTo) {
      const from = processedState.totalFrom
        ? parseFloat(processedState.totalFrom)
        : undefined;
      const to = processedState.totalTo
        ? parseFloat(processedState.totalTo)
        : undefined;

      processedState.total = [from, to];
    }

    return data.filter((row) => compare(row, processedState));
  };
}
