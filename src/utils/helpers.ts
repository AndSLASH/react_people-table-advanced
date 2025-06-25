import { Person, SortBy, SortOrder } from '../types';

export const getCenturyFromYear = (year: number): number => {
  return Math.ceil(year / 100);
};

export const getAge = (person: Person): number | undefined => {
  if (!person.born) {
    return undefined;
  }

  const currentYear = new Date().getFullYear();
  const age =
    person.died && person.died !== 0
      ? person.died - person.born
      : currentYear - person.born;

  if (age < 0) {
    return undefined;
  }

  return age;
};

export const getSearchParamsAsArray = (
  params: URLSearchParams,
  paramName: string,
): string[] => {
  return params.getAll(paramName);
};

export const applyFilters = (
  people: Person[],
  searchParams: URLSearchParams,
): Person[] => {
  let filteredPeople = [...people];

  const selectedCenturies = searchParams.getAll('centuries').map(Number);

  if (selectedCenturies.length > 0) {
    filteredPeople = filteredPeople.filter(person => {
      if (person.born) {
        const century = getCenturyFromYear(person.born);

        return selectedCenturies.includes(century);
      }

      return false;
    });
  }

  const selectedSex = searchParams.get('sex');

  if (selectedSex) {
    filteredPeople = filteredPeople.filter(
      person => person.sex === selectedSex,
    );
  }

  const nameQuery = searchParams.get('query')?.toLowerCase();

  if (nameQuery) {
    filteredPeople = filteredPeople.filter(person =>
      person.name.toLowerCase().includes(nameQuery),
    );
  }

  return filteredPeople;
};

export const applySort = (
  people: Person[],
  sortBy: SortBy | null,
  order: SortOrder | null,
): Person[] => {
  if (!sortBy || !order) {
    return [...people];
  }

  const sortedPeople = [...people];

  sortedPeople.sort((a, b) => {
    let valueA = a[sortBy];
    let valueB = b[sortBy];

    if (sortBy === 'born' || sortBy === 'died') {
      valueA = valueA === 0 ? Infinity : valueA || Infinity;
      valueB = valueB === 0 ? Infinity : valueB || Infinity;
    } else {
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
      }

      if (typeof valueB === 'string') {
        valueB = valueB.toLowerCase();
      }
    }

    if (valueA < valueB) {
      return order === 'asc' ? -1 : 1;
    }

    if (valueA > valueB) {
      return order === 'asc' ? 1 : -1;
    }

    return 0;
  });

  return sortedPeople;
};
