import { Dispatch, SetStateAction } from 'react';
import { MULTIMEDIA, TEXT_SHORT } from './constant';
import { generateShortUUIDV4 } from './helpers';
import { IChoice, InputSurveyResponseFeedback, IQuestionnairField } from './interface/general.interface';

export const formElementAdd = (
  questionnaireFields: IQuestionnairField[],
  setQuestionnaireFields: Dispatch<SetStateAction<IQuestionnairField[]>>,
) => {
  const formElement: IQuestionnairField = {
    id: generateShortUUIDV4(),
    question: '',
    isRequired: false,
    noDuplicateResponse: false,
    feedbackType: TEXT_SHORT,
    optionsChoiceSingle: [],
    optionsChoiceMultiple: [],
    optionsDropdown: [],
    allowMultipleFileUploads: false,
  };

  const updatedFields = [...questionnaireFields, formElement];
  setQuestionnaireFields(updatedFields);
};


export const formElementRemove = (
  id: string,
  questionnaireFields: IQuestionnairField[],
  setQuestionnaireFields: Dispatch<SetStateAction<IQuestionnairField[]>>,
) => {
  const tmpFormElements = [...questionnaireFields];
  const index = tmpFormElements.findIndex((f) => f.id === id);

  if (index > -1) tmpFormElements.splice(index, 1);

  setQuestionnaireFields(tmpFormElements);
};

export const formElementQuestionEdit = (
  id: string,
  question: any,
  questionnaireFields: IQuestionnairField[],
  setQuestionnaireFields: Dispatch<SetStateAction<IQuestionnairField[]>>,
) => {
  const tmpFormElements = [...questionnaireFields];
  const index = tmpFormElements.findIndex((f) => f.id === id);

  if (index > -1) tmpFormElements[index].question = question;

  setQuestionnaireFields(tmpFormElements);
};

export const answerTypeEdit = (
  id: string,
  feedbackType: any,
  questionnaireFields: IQuestionnairField[],
  setQuestionnaireFields: Dispatch<SetStateAction<IQuestionnairField[]>>,
) => {
  const tmpFormElements = [...questionnaireFields];
  const index = tmpFormElements.findIndex((f) => f.id === id);

  if (index > -1) tmpFormElements[index].feedbackType = feedbackType;

  setQuestionnaireFields(tmpFormElements);
};

export const formElementDropDownOptionAdd = (
  id: string,
  dropDownOption: string,
  setDropdownOption: Dispatch<SetStateAction<string>>,
  questionnaireFields: IQuestionnairField[],
  setQuestionnaireFields: Dispatch<SetStateAction<IQuestionnairField[]>>,
) => {
  const tmpFormElements = [...questionnaireFields];
  const index = tmpFormElements.findIndex((f) => f.id === id);

  if (index > -1) {
    tmpFormElements[index].optionsDropdown?.push({
      value: dropDownOption,
      label: dropDownOption,
    });
  }
  setQuestionnaireFields(tmpFormElements);
  setDropdownOption('');
};

export const formElementDropDownOptionRemove = (
  id: string,
  value: string,
  setDropdownOption: Dispatch<SetStateAction<string>>,
  questionnaireFields: IQuestionnairField[],
  setQuestionnaireFields: Dispatch<SetStateAction<IQuestionnairField[]>>,
) => {
  const tmpFormElements = [...questionnaireFields];
  const index = tmpFormElements.findIndex((f) => f.id === id);

  if (index > -1) {
    const _index = tmpFormElements[index].optionsDropdown?.findIndex((f) => f.value === value);

    if (_index && _index > -1) {
      tmpFormElements[index].optionsDropdown?.splice(_index, 1);
    }
  }
  setQuestionnaireFields(tmpFormElements);
  setDropdownOption('');
};

export const editFormElementIsRequired = (
  id: string,
  isRequired: boolean,
  questionnaireFields: IQuestionnairField[],
  setQuestionnaireFields: Dispatch<SetStateAction<IQuestionnairField[]>>,
) => {
  const tmpFormElements = [...questionnaireFields];
  const index = tmpFormElements.findIndex((f) => f.id === id);

  if (index > -1) {
    tmpFormElements[index].isRequired = isRequired;
  }
  setQuestionnaireFields(tmpFormElements);
};

export const editFormElementNoDuplicateResponse = (
  id: string,
  noDuplicateResponse: boolean,
  questionnaireFields: IQuestionnairField[],
  setQuestionnaireFields: Dispatch<SetStateAction<IQuestionnairField[]>>,
) => {
  const tmpFormElements = [...questionnaireFields];
  const index = tmpFormElements.findIndex((f) => f.id === id);

  if (index > -1) {
    tmpFormElements[index].noDuplicateResponse = noDuplicateResponse;
  }
  setQuestionnaireFields(tmpFormElements);
};

export const singleChoiceAdd = (
  id: string,
  singleChoice: IChoice,
  setSingleChoice: Dispatch<SetStateAction<IChoice>>,
  questionnaireFields: IQuestionnairField[],
  setQuestionnaireFields: Dispatch<SetStateAction<IQuestionnairField[]>>,
) => {
  const tmpFormElements = [...questionnaireFields];
  const index = tmpFormElements.findIndex((f) => f.id === id);

  if (index > -1) {
    tmpFormElements[index].optionsChoiceSingle?.push(singleChoice);
  }
  setQuestionnaireFields(tmpFormElements);
  setSingleChoice({});
};

export const singleChoiceRemove = (
  id: string,
  value: IChoice,
  setSingleChoice: Dispatch<SetStateAction<IChoice>>,
  questionnaireFields: IQuestionnairField[],
  setQuestionnaireFields: Dispatch<SetStateAction<IQuestionnairField[]>>,
) => {
  const tmpFormElements = [...questionnaireFields];
  const index = tmpFormElements.findIndex((f) => f.id === id);

  if (index > -1) {
    const _index = tmpFormElements[index].optionsChoiceSingle?.findIndex(
      (option) => option.text === value.text,
    );

    if (_index && _index > -1) {
      tmpFormElements[index].optionsChoiceSingle?.splice(_index, 1);
    }
  }
  setQuestionnaireFields(tmpFormElements);
  setSingleChoice({});
};

export const formElementMultichoiceAdd = (
  id: string,
  multichoice: IChoice,
  setMultichoice: Dispatch<SetStateAction<IChoice>>,
  questionnaireFields: IQuestionnairField[],
  setQuestionnaireFields: Dispatch<SetStateAction<IQuestionnairField[]>>,
) => {
  const tmpFormElements = [...questionnaireFields];
  const index = tmpFormElements.findIndex((f) => f.id === id);

  if (index > -1) {
    tmpFormElements[index].optionsChoiceMultiple?.push(multichoice);
  }
  setQuestionnaireFields(tmpFormElements);
  setMultichoice({});
};

export const formElementMultiplechoiceRemove = (
  id: string,
  value: IChoice,
  setMultichoice: Dispatch<SetStateAction<IChoice>>,
  questionnaireFields: IQuestionnairField[],
  setQuestionnaireFields: Dispatch<SetStateAction<IQuestionnairField[]>>,
) => {
  const tmpFormElements = [...questionnaireFields];
  const index = tmpFormElements.findIndex((f) => f.id === id);

  if (index > -1) {
    const _index = tmpFormElements[index].optionsChoiceMultiple?.findIndex((f) => f.text === value.text);

    if (_index && _index > -1) {
      tmpFormElements[index].optionsChoiceMultiple?.splice(_index, 1);
    }
  }
  setQuestionnaireFields(tmpFormElements);
  setMultichoice({});
};

export const editFormElementAllowMultipleFileUploads = (
  id: string,
  questionnaireFields: IQuestionnairField[],
  setQuestionnaireFields: Dispatch<SetStateAction<IQuestionnairField[]>>,
) => {
  const tmpFormElements = [...questionnaireFields];
  const index = tmpFormElements.findIndex((f) => f.id === id);

  if (index > -1) {
    tmpFormElements[index].allowMultipleFileUploads = !tmpFormElements[index].allowMultipleFileUploads;
  }
  setQuestionnaireFields(tmpFormElements);
};

export const findFeedback = (
  fieldId: string,
  questionnaireFields: IQuestionnairField[],
): string | IChoice[] | InputSurveyResponseFeedback | undefined => {
  const index = questionnaireFields.findIndex((field) => field.id === fieldId);

  if (index > -1) return questionnaireFields[index].feedback;
  return undefined;
};

export const removeDocumentFeedback = (
  fieldId: string,
  documentId: string,
  questionnaireFields: IQuestionnairField[],
  setQuestionnaireFields: Dispatch<SetStateAction<IQuestionnairField[]>>,
): void => {
  const tmpFormElements = [...questionnaireFields];
  const index = tmpFormElements.findIndex((field) => field.id === fieldId);

  if (index > -1) {
    const indexDocument = (tmpFormElements[index].feedback as string[]).findIndex(
      (docId) => docId === documentId,
    );

    if (indexDocument > -1) {
      (tmpFormElements[index].feedback as string[]).splice(indexDocument, 1);

      setQuestionnaireFields(tmpFormElements);
    }
  }
};

export const editFeedback = (
  id: string,
  feedback: any,
  questionnaireFields: IQuestionnairField[],
  setQuestionnaireFields: Dispatch<SetStateAction<IQuestionnairField[]>>,
) => {
  const tmpFormElements = [...questionnaireFields];
  const index = tmpFormElements.findIndex((field) => field.id === id);

  if (index > -1) {
    tmpFormElements[index].feedback = { _string: feedback };
  }
  setQuestionnaireFields(tmpFormElements);
};

export const editFeedbackSingleChoice = (
  id: string,
  feedback: any,
  questionnaireFields: IQuestionnairField[],
  setQuestionnaireFields: Dispatch<SetStateAction<IQuestionnairField[]>>,
) => {
  const tmpFormElements = [...questionnaireFields];
  const index = tmpFormElements.findIndex((field) => field.id === id);

  if (index > -1) {
    tmpFormElements[index].feedback = { _choice: feedback };
  }
  setQuestionnaireFields(tmpFormElements);
};

export const editFeedbackMultiChoice = (
  id: string,
  item: IChoice,
  questionnaireFields: IQuestionnairField[],
  setQuestionnaireFields: Dispatch<SetStateAction<IQuestionnairField[]>>,
) => {
  const tmpFormElements = [...questionnaireFields];
  const index = tmpFormElements.findIndex((f) => f.id === id);

  if (index > -1) {
    if (tmpFormElements[index].feedback?._choiceArray) {
      const _index = tmpFormElements[index].feedback._choiceArray.findIndex((_item) => _item === item);

      if (_index < 0) {
        tmpFormElements[index].feedback._choiceArray.push(item);
      } else {
        tmpFormElements[index].feedback._choiceArray.splice(_index, 1);
      }
    } else {
      tmpFormElements[index].feedback = { _choiceArray: [item] };
    }

    // if (Array.isArray(tmpFormElements[index].feedback)) {
    //   const _index = tmpFormElements[index].feedback?.findIndex((_item) => _item === item);

    //   if (_index < 0) {
    //     tmpFormElements[index].feedback?.push(item);
    //   } else {
    //     tmpFormElements[index].feedback?.splice(_index, 1);
    //   }
    // } else {
    //   tmpFormElements[index].feedback = [item];
    // }
  }

  setQuestionnaireFields(tmpFormElements);
};
