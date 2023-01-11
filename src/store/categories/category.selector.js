import { createSelector } from 'reselect'

const selectCategoryReducer = state => state.categories

// Create a memoized selector; first argument is an arrray of input selectors, swecond argument is the output selector; it only runs when the categoriesSlice is different
export const selectCategories = createSelector(
  [selectCategoryReducer],
  categoriesSlice => categoriesSlice.categories
)

// It runs once, but the, as long as the categories array does not change, this method does not run
export const selectCategoriesMap = createSelector(
  [selectCategories],
  categories =>
    categories.reduce((acc, category) => {
      const { title, items } = category
      acc[title.toLowerCase()] = items
      return acc
    }, {})
)