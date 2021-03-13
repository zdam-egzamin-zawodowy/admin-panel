import { Profession, QualificationInput } from 'libs/graphql/types';

export type ExtendedProfession = Profession & {
  disabled?: boolean;
};

export type Input = Omit<
  QualificationInput,
  'associateProfession' | 'dissociateProfession'
> & {
  professions: ExtendedProfession[];
};
