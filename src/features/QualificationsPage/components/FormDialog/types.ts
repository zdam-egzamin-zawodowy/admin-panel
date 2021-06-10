import { Profession, QualificationInput } from 'libs/graphql/types';

export type Input = Omit<
  QualificationInput,
  'associateProfession' | 'dissociateProfession'
> & {
  professions: Profession[];
};
