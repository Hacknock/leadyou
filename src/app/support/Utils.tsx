export const chunked = (array: string[], chunk: number): string[][] => {
  return array.reduce<string[][]>((result, value, index) => {
    if (index % chunk === 0) {
      result.push([value]);
    } else {
      result[result.length - 1].push(value);
    }
    return result;
  }, []);
};
