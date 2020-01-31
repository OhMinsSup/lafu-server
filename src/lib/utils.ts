export function normalize<T>(
  array: T[],
  selector: (item: T) => string | number = (item: any) => item.id
) {
  const object: {
    [key: string]: T;
  } = {};
  array.forEach(item => {
    object[selector(item)] = item;
  });
  return object;
}

export function normalizeKeyOfKey(array: string[]) {
  const object: {
    [key: string]: string;
  } = {};
  array.forEach(key => {
    object[key] = key;
  });
}

export function groupById<T>(order: string[], data: T[], idResolver: (row: T) => string) {
  const map: {
    [key: string]: T[];
  } = {};
  // creates array for every key
  order.forEach(id => {
    map[id] = [];
  });
  data.forEach(row => {
    map[idResolver(row)].push(row);
  });
  const ordered = order.map(id => map[id]);
  return ordered;
}
