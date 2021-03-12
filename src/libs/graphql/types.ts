export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: number;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Upload: any;
  Time: any;
};




export type UpdateManyUsersInput = {
  role?: Maybe<Role>;
  activated?: Maybe<Scalars['Boolean']>;
};

export type QualificationFilterOr = {
  nameMatch?: Maybe<Scalars['String']>;
  nameIEQ?: Maybe<Scalars['String']>;
  codeMatch?: Maybe<Scalars['String']>;
  codeIEQ?: Maybe<Scalars['String']>;
};

export type QuestionList = {
  total: Scalars['Int'];
  items?: Maybe<Array<Question>>;
};

export type ProfessionList = {
  total: Scalars['Int'];
  items?: Maybe<Array<Profession>>;
};

export type QuestionInput = {
  content?: Maybe<Scalars['String']>;
  from?: Maybe<Scalars['String']>;
  explanation?: Maybe<Scalars['String']>;
  correctAnswer?: Maybe<Answer>;
  qualificationID?: Maybe<Scalars['Int']>;
  image?: Maybe<Scalars['Upload']>;
  deleteImage?: Maybe<Scalars['Boolean']>;
  answerA?: Maybe<Answer>;
  answerAImage?: Maybe<Scalars['Upload']>;
  deleteAnswerAImage?: Maybe<Scalars['Boolean']>;
  answerB?: Maybe<Answer>;
  answerBImage?: Maybe<Scalars['Upload']>;
  deleteAnswerBImage?: Maybe<Scalars['Boolean']>;
  answerC?: Maybe<Answer>;
  answerCImage?: Maybe<Scalars['Upload']>;
  deleteAnswerCImage?: Maybe<Scalars['Boolean']>;
  answerD?: Maybe<Answer>;
  answerDImage?: Maybe<Scalars['Upload']>;
  deleteAnswerDImage?: Maybe<Scalars['Boolean']>;
};

export type UserFilter = {
  id?: Maybe<Array<Scalars['ID']>>;
  idNEQ?: Maybe<Array<Scalars['ID']>>;
  activated?: Maybe<Scalars['Boolean']>;
  displayName?: Maybe<Array<Scalars['String']>>;
  displayNameNEQ?: Maybe<Array<Scalars['String']>>;
  displayNameIEQ?: Maybe<Scalars['String']>;
  displayNameMATCH?: Maybe<Scalars['String']>;
  email?: Maybe<Array<Scalars['String']>>;
  emailNEQ?: Maybe<Array<Scalars['String']>>;
  emailIEQ?: Maybe<Scalars['String']>;
  emailMATCH?: Maybe<Scalars['String']>;
  role?: Maybe<Array<Role>>;
  roleNEQ?: Maybe<Array<Role>>;
  createdAt?: Maybe<Scalars['Time']>;
  createdAtGT?: Maybe<Scalars['Time']>;
  createdAtGTE?: Maybe<Scalars['Time']>;
  createdAtLT?: Maybe<Scalars['Time']>;
  createdAtLTE?: Maybe<Scalars['Time']>;
  or?: Maybe<UserFilterOr>;
};

export type Profession = {
  id: Scalars['ID'];
  slug: Scalars['String'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  createdAt: Scalars['Time'];
};

export enum Answer {
  A = 'a',
  B = 'b',
  C = 'c',
  D = 'd'
}

export type QuestionFilter = {
  id?: Maybe<Array<Scalars['ID']>>;
  idNEQ?: Maybe<Array<Scalars['ID']>>;
  from?: Maybe<Array<Scalars['String']>>;
  contentIEQ?: Maybe<Scalars['String']>;
  contentMATCH?: Maybe<Scalars['String']>;
  qualificationID?: Maybe<Array<Scalars['Int']>>;
  qualificationIDNEQ?: Maybe<Array<Scalars['Int']>>;
  qualificationFilter?: Maybe<QualificationFilter>;
  createdAt?: Maybe<Scalars['Time']>;
  createdAtGT?: Maybe<Scalars['Time']>;
  createdAtGTE?: Maybe<Scalars['Time']>;
  createdAtLT?: Maybe<Scalars['Time']>;
  createdAtLTE?: Maybe<Scalars['Time']>;
};

export type UserFilterOr = {
  displayNameIEQ?: Maybe<Scalars['String']>;
  displayNameMATCH?: Maybe<Scalars['String']>;
  emailIEQ?: Maybe<Scalars['String']>;
  emailMATCH?: Maybe<Scalars['String']>;
};

export type ProfessionFilter = {
  id?: Maybe<Array<Scalars['ID']>>;
  idNEQ?: Maybe<Array<Scalars['ID']>>;
  slug?: Maybe<Array<Scalars['String']>>;
  slugNEQ?: Maybe<Array<Scalars['String']>>;
  name?: Maybe<Array<Scalars['String']>>;
  nameNEQ?: Maybe<Array<Scalars['String']>>;
  nameIEQ?: Maybe<Scalars['String']>;
  nameMATCH?: Maybe<Scalars['String']>;
  descriptionIEQ?: Maybe<Scalars['String']>;
  descriptionMATCH?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['Time']>;
  createdAtGT?: Maybe<Scalars['Time']>;
  createdAtGTE?: Maybe<Scalars['Time']>;
  createdAtLT?: Maybe<Scalars['Time']>;
  createdAtLTE?: Maybe<Scalars['Time']>;
};

export type QualificationList = {
  total: Scalars['Int'];
  items?: Maybe<Array<Qualification>>;
};

export type Question = {
  id: Scalars['ID'];
  from?: Maybe<Scalars['String']>;
  content: Scalars['String'];
  explanation?: Maybe<Scalars['String']>;
  correctAnswer: Answer;
  image?: Maybe<Scalars['String']>;
  answerA?: Maybe<Answer>;
  answerAImage?: Maybe<Scalars['String']>;
  answerB?: Maybe<Answer>;
  answerBImage?: Maybe<Scalars['String']>;
  answerC?: Maybe<Answer>;
  answerCImage?: Maybe<Scalars['String']>;
  answerD?: Maybe<Answer>;
  answerDImage?: Maybe<Scalars['String']>;
  qualification?: Maybe<Qualification>;
  createdAt: Scalars['Time'];
  updatedAt: Scalars['Time'];
};

export type UserList = {
  total: Scalars['Int'];
  items?: Maybe<Array<User>>;
};

export type UserWithToken = {
  token: Scalars['String'];
  user: User;
};

export type Query = {
  professions: ProfessionList;
  profession?: Maybe<Profession>;
  qualifications: QualificationList;
  qualification?: Maybe<Qualification>;
  questions: QuestionList;
  generateTest?: Maybe<Array<Question>>;
  users: UserList;
  user?: Maybe<User>;
  me?: Maybe<User>;
};


export type QueryProfessionsArgs = {
  filter?: Maybe<ProfessionFilter>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  sort?: Maybe<Array<Scalars['String']>>;
};


export type QueryProfessionArgs = {
  id?: Maybe<Scalars['Int']>;
  slug?: Maybe<Scalars['String']>;
};


export type QueryQualificationsArgs = {
  filter?: Maybe<QualificationFilter>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  sort?: Maybe<Array<Scalars['String']>>;
};


export type QueryQualificationArgs = {
  id?: Maybe<Scalars['Int']>;
  slug?: Maybe<Scalars['String']>;
};


export type QueryQuestionsArgs = {
  filter?: Maybe<QuestionFilter>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  sort?: Maybe<Array<Scalars['String']>>;
};


export type QueryGenerateTestArgs = {
  qualificationIDs: Array<Scalars['ID']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QueryUsersArgs = {
  filter?: Maybe<UserFilter>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  sort?: Maybe<Array<Scalars['String']>>;
};


export type QueryUserArgs = {
  id: Scalars['Int'];
};

export type Mutation = {
  createProfession?: Maybe<Profession>;
  updateProfession?: Maybe<Profession>;
  deleteProfessions?: Maybe<Array<Profession>>;
  createQualification?: Maybe<Qualification>;
  updateQualification?: Maybe<Qualification>;
  deleteQualifications?: Maybe<Array<Qualification>>;
  createQuestion?: Maybe<Question>;
  updateQuestion?: Maybe<Question>;
  deleteQuestions?: Maybe<Array<Question>>;
  createUser?: Maybe<User>;
  updateUser?: Maybe<User>;
  updateManyUsers?: Maybe<Array<User>>;
  deleteUsers?: Maybe<Array<User>>;
  signIn?: Maybe<UserWithToken>;
};


export type MutationCreateProfessionArgs = {
  input: ProfessionInput;
};


export type MutationUpdateProfessionArgs = {
  id: Scalars['ID'];
  input: ProfessionInput;
};


export type MutationDeleteProfessionsArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationCreateQualificationArgs = {
  input: QualificationInput;
};


export type MutationUpdateQualificationArgs = {
  id: Scalars['ID'];
  input: QualificationInput;
};


export type MutationDeleteQualificationsArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationCreateQuestionArgs = {
  input: QuestionInput;
};


export type MutationUpdateQuestionArgs = {
  id: Scalars['ID'];
  input: QuestionInput;
};


export type MutationDeleteQuestionsArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationCreateUserArgs = {
  input: UserInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID'];
  input: UserInput;
};


export type MutationUpdateManyUsersArgs = {
  ids: Array<Scalars['ID']>;
  input: UpdateManyUsersInput;
};


export type MutationDeleteUsersArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationSignInArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  staySignedIn?: Maybe<Scalars['Boolean']>;
};

export type ProfessionInput = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type QualificationInput = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  formula?: Maybe<Scalars['String']>;
  associateProfession?: Maybe<Array<Scalars['Int']>>;
  dissociateProfession?: Maybe<Array<Scalars['Int']>>;
};


export enum Role {
  Admin = 'admin',
  User = 'user'
}

export type UserInput = {
  displayName?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  role?: Maybe<Role>;
  activated?: Maybe<Scalars['Boolean']>;
};

export type Qualification = {
  id: Scalars['ID'];
  slug: Scalars['String'];
  name: Scalars['String'];
  code: Scalars['String'];
  formula?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  createdAt: Scalars['Time'];
};

export type QualificationFilter = {
  id?: Maybe<Array<Scalars['ID']>>;
  idNEQ?: Maybe<Array<Scalars['ID']>>;
  slug?: Maybe<Array<Scalars['String']>>;
  slugNEQ?: Maybe<Array<Scalars['String']>>;
  formula?: Maybe<Array<Scalars['String']>>;
  formulaNEQ?: Maybe<Array<Scalars['String']>>;
  name?: Maybe<Array<Scalars['String']>>;
  nameNEQ?: Maybe<Array<Scalars['String']>>;
  nameIEQ?: Maybe<Scalars['String']>;
  nameMATCH?: Maybe<Scalars['String']>;
  code?: Maybe<Array<Scalars['String']>>;
  codeNEQ?: Maybe<Array<Scalars['String']>>;
  codeIEQ?: Maybe<Scalars['String']>;
  codeMATCH?: Maybe<Scalars['String']>;
  descriptionIEQ?: Maybe<Scalars['String']>;
  descriptionMATCH?: Maybe<Scalars['String']>;
  professionID?: Maybe<Array<Scalars['Int']>>;
  createdAt?: Maybe<Scalars['Time']>;
  createdAtGT?: Maybe<Scalars['Time']>;
  createdAtGTE?: Maybe<Scalars['Time']>;
  createdAtLT?: Maybe<Scalars['Time']>;
  createdAtLTE?: Maybe<Scalars['Time']>;
  or?: Maybe<QualificationFilterOr>;
};


export type User = {
  id: Scalars['ID'];
  displayName: Scalars['String'];
  role: Role;
  email: Scalars['String'];
  activated: Scalars['Boolean'];
  createdAt: Scalars['Time'];
};
