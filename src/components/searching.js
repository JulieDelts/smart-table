import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
  const searchComparator = createComparison(
    ["skipEmptyTargetValues"],
    [
      rules.searchMultipleFields(
        searchField,
        ["date", "customer", "seller"],
        false,
      ),
    ],
  );

  return (data, state, action) => {
    const searchValue = state[searchField];
    if (!searchValue || searchValue.trim() === "") {
      return data;
    }

    return data.filter((item) => {
      const target = { [searchField]: searchValue };
      return searchComparator(item, target);
    });
  };
}
