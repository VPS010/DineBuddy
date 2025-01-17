import { atom } from 'recoil';

export const cartState = atom({
  key: 'cartState',
  default: []
});

export const searchQueryState = atom({
  key: 'searchQueryState',
  default: ''
});

export const selectedCategoryState = atom({
  key: 'selectedCategoryState',
  default: 'All'
});

export const sortByState = atom({
  key: 'sortByState',
  default: 'name'
});

export const menuDataState = atom({
  key: 'menuDataState',
  default: []
});

export const isCartOpenState = atom({
  key: 'isCartOpenState',
  default: false
});

export const selectedItemState = atom({
  key: 'selectedItemState',
  default: null
});

export const isVegOnlyState = atom({
  key: 'isVegOnlyState',
  default: false
});
