import { createComparison, defaultRules } from "../lib/compare.js";

const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  Object.keys(indexes).forEach((elementName) => {
    elements[elementName].append(
      ...Object.values(indexes[elementName]).map((name) => {
        const option = document.createElement("option");
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

    return data.filter((row) => compare(row, state));
  };
}
