import React from 'react';
import cn from 'classnames';
import { Link, useSearchParams } from 'react-router-dom';
import { Person as PersonType, Sex } from '../types';
import { getSearchWith } from '../utils/searchHelper';

interface PersonLinkProps {
  person: PersonType;
  currentSelectedSlug: string | null;
}

export const PersonLink: React.FC<PersonLinkProps> = ({
  person,
  currentSelectedSlug,
}) => {
  const { name, sex, slug } = person;
  const [searchParams] = useSearchParams();

  const targetPathname =
    currentSelectedSlug === slug ? '/people' : `/people/${slug}`;

  const LinkTo = {
    pathname: targetPathname,
    search: getSearchWith(searchParams, {}),
  };

  const linkClasses = cn({ 'has-text-danger': sex === Sex.Female });

  return (
    <Link to={LinkTo} className={linkClasses}>
      {name}
    </Link>
  );
};
