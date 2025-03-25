import type { DocumentNode } from 'graphql';
import type {
  Dispatch,
  SetStateAction,
  MouseEventHandler} from 'react';
import type {
  ApolloQueryResult,
  TypedDocumentNode,
  OperationVariables,
} from '@apollo/client';

import type { TAnswerType } from '../constant';

export interface IGQLQuery {
  refetch: (variables?: Partial<any>) => Promise<ApolloQueryResult<any>>;
  loading: boolean;
  data?: any;
}

export interface IGQLMutation {
  action: Function;
  loading: boolean;
  data?: any;
}

export interface InputGQLMutation {
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>;
  resolver: string;
  toastmsg?: boolean;
  callback?: Function;
}

export interface InputGQLQuery {
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>;
  queryAction: string;
  variables?: OperationVariables;
}

export interface IMutationButton {
  label?: string;
  icon: string;
  loading: boolean;
  outline?: boolean;
  disable?: boolean;
  className?: string;
  btntype?: string;
  size?: 'xl' | 'lg' | 'md' | 'sm' | undefined;
  type?: 'button' | 'submit' | 'reset' | undefined;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}

export interface TState {
  theme: string;
  label: string;
}

export interface PageTitleNavigation {
  title: string;
  path?: string;
}

export interface ISelectMultiple {
  checkbox: boolean;
  asset: string;
  allOptions: never[];
  options: never[];
  selected: never[];
  disablePreselected: boolean;
  disable?: boolean;
  displayValue?: string;
  setOptions: (data: any) => void;
  setSelected: (data: any) => void;
}

export interface ISelectSingle {
  options: any[];
  isLoading?: boolean;
  placeholder?: string;
  onChange: Dispatch<SetStateAction<any>>;
}

export interface ISelectSingleOption {
  id: string | null;
  name?: string;
}

export interface T_Option {
  label: string;
  value?: any;
}

export interface IPhoneNumberInput {
  input: any;
  phonekey: string;
  required?: boolean;
  onChange: (value: SetStateAction<any>) => void;
}

export interface IPhoneNumberInputLegacy {
  value: string;
  onChange: (value: SetStateAction<any>) => void;
  required?: boolean;
}

export interface IWYSIWYG {
  value: string | undefined;
  placeholder: string;
  defaultValue?: string;
  height?: string;
  limited?: boolean;
  setValue: (value: string) => void;
}

export interface IInventoryAllocation {
  campaignRunId: string;
  clientTier2Id: string;
}

export interface IAllocations {
  index: number;
  id: string;
  name: string;
  photo: string;
  allocated: number;
  sold: number;
}

export interface IGeoLocation {
  latitude?: number;
  longitude?: number;
  error?: string;
}

export interface IAnswerDropdownOption {
  value: string;
  label: string;
}

// export interface IAnswerChoiceMultiple {
//   label: string;
//   value: IChoice;
// }

export interface IQuestionnairField {
  id: string;
  isRequired: boolean;
  noDuplicateResponse: boolean;
  question: string;
  optionsChoiceSingle?: IChoice[];
  optionsChoiceMultiple?: IChoice[];
  optionsDropdown?: IAnswerDropdownOption[];
  feedbackType: TAnswerType;
  feedback?: InputSurveyResponseFeedback | string | IChoice[];
  allowMultipleFileUploads: boolean;
}

export interface IQuestionnaireSetup {
  questionnaireFields: IQuestionnairField[];
  setQuestionnaireFields: Dispatch<SetStateAction<IQuestionnairField[]>>;
}

export interface IQuestionnaireForm {
  questionnaireFields: IQuestionnairField[];
  setQuestionnaireFields: Dispatch<SetStateAction<IQuestionnairField[]>>;
  submitting: boolean;
  handleSubmit: (e: Event) => void;
}

export interface InputSurveyUpdate {
  id?: string;
  clientTier2Id?: string;
  campaignRunId?: string;
  name?: string;
  description?: string;
  questionnaireFields?: IQuestionnairField[];
}

export interface ISingleChoiceEdit {
  id: string;
  value1?: string;
  value2?: string;
}

export interface InputSurveyResponseFeedback {
  _string?: string;
  _stringArray?: string[];
  _choice?: IChoice;
  _choiceArray?: IChoice[];
}

export interface InputSurveyResponse {
  questionnaireFieldId: string;
  feedback: InputSurveyResponseFeedback | string | string[] | IChoice[];
}

export interface InputSurveyReportCreate {
  respondentName?: string;
  respondentPhone?: string;
  respondentEmail?: string;
}

export interface ISurveyReportTarget {
  surveyId: string;
}

export interface IAgentTarget {
  agentId: string;
  target: number;
  _filled?: number;
  _agent?: any;
}

export interface IChoice {
  text?: string;
  documentId?: string;
}

interface IAgentOriginContextLabel {
  title: string;
  abbreviation: string;
}

export interface IAgentOriginContext {
  nin: IAgentOriginContextLabel;
  tin: IAgentOriginContextLabel;
  hin: IAgentOriginContextLabel;
  ssn: IAgentOriginContextLabel;
}

export interface IManageAgentKYC {
  agentId?: string;
  phone?: string;
}

export interface IInputConfigCreate {
  campaignRunId?: string;
  salePackagingId?: string;
  saleUnits?: number;
  giveawayPackagingId?: string;
  giveawayUnits?: number;
}

export interface IInputConfigUpdate {
  id?: string;
  salePackagingId?: string;
  saleUnits?: number;
  giveawayPackagingId?: string;
  giveawayUnits?: number;
}

export interface IFreeGiveawayAllocations {
  index: number;
  id: string;
  name: string;
  photo: string;
  allocated: number;
  givenAway: number;
}

export interface InputSalesGiveawaySurveyReportCreate {
  salesGiveawayConfigId?: string;
  quantityGiven?: number;
  respondentName?: string;
  respondentPhone?: string;
  respondentEmail?: string;
}

export interface InputFreeGiveawaySurveyReportCreate {
  respondentName?: string;
  respondentPhone?: string;
  respondentEmail?: string;
  freeGiveawayAllocationId?: string;
  quantityGiven?: number;
}

export interface ISurveyReportBody {
  surveyId?: string;
  salesSurveyId?: string;
  salesGiveawaySurveyId?: string;
  freeGiveawaySurveyId?: string;
  agentId?: string;
  _reportName?: string;
  date?: Date;
  page?: number;
  pageSize?: number;
}
