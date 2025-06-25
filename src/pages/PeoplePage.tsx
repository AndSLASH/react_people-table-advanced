import { PeopleFilters } from '../components/PeopleFilters';
import { Loader } from '../components/Loader';
import { PeopleTable } from '../components/PeopleTable';
import { useEffect, useState, useMemo } from 'react';
import { getPeople } from '../api';
import { Person, SortBy, SortOrder } from '../types';
import { useParams, useSearchParams } from 'react-router-dom';
import { PeopleProvider } from '../contexts';
import { applyFilters, applySort } from '../utils/helpers';

export const PeoplePage: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [peopleLookup, setPeopleLookup] = useState<Map<string, Person>>(
    new Map(),
  );

  const { slug: personSlug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
  const sortBy = (searchParams.get('sort') as SortBy) || null;
  const order = (searchParams.get('order') as SortOrder) || null;

  useEffect(() => {
    setLoading(true);
    setError('');

    getPeople()
      .then((data: Person[]) => {
        setPeople(data);

        const newLookup = new Map<string, Person>();

        data.forEach(p => {
          newLookup.set(p.name, p);
        });

        setPeopleLookup(newLookup);
      })
      .catch(() => {
        setError('Something went wrong');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const processedPeople = useMemo(() => {
    let currentPeople = applyFilters(people, searchParams);

    currentPeople = applySort(currentPeople, sortBy, order);

    return currentPeople;
  }, [people, searchParams, sortBy, order]);

  const peopleNotLoaded = !loading && !error && people.length === 0;

  const peopleLoaded = !loading && !error && people.length > 0;

  const peopleNotFound =
    !loading && !error && people.length > 0 && processedPeople.length === 0;

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="columns is-desktop is-flex-direction-row-reverse">
          {peopleLoaded && (
            <div className="column is-7-tablet is-narrow-desktop">
              <PeopleFilters />
            </div>
          )}

          <div className="column">
            <div className="box table-container">
              {loading && <Loader />}

              {error && (
                <p data-cy="peopleLoadingError" className="has-text-danger">
                  {error}
                </p>
              )}

              {peopleNotLoaded && (
                <p data-cy="noPeopleMessage">
                  There are no people on the server
                </p>
              )}

              {peopleNotFound && (
                <p>There are no people matching the current search criteria</p>
              )}

              {peopleLoaded ? (
                <PeopleProvider peopleLookup={peopleLookup}>
                  <PeopleTable
                    people={processedPeople}
                    selectedPersonSlug={personSlug || null}
                    sortBy={sortBy}
                    order={order}
                  />
                </PeopleProvider>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
