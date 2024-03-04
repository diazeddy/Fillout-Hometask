import axiosClient from "../axios/axiosClient";
import { MAX_PAGE_SIZE, UNRECOGNIZED_FILTER_CONDITION } from "../constants";

import {
  FilterClauseType,
  FilterCondition,
  FormbSubmissionResponse,
  InputType,
  QuestionResponse,
  ResponseFiltersType,
} from "../../main.types";

export const fetchResponses = async (
  formId: string,
  params?: Record<string, any> | undefined
): Promise<FormbSubmissionResponse> => {
  return (
    await axiosClient.get(`/forms/${formId}/submissions`, {
      params,
    })
  ).data;
};

export const fetchAllResponses = async (
  formId: string,
  params?: Record<string, any> | undefined
) => {
  const { pageCount } = await fetchResponses(formId);

  return (
    await Promise.all(
      Array(pageCount)
        .fill(undefined)
        .map((_, idx) =>
          fetchResponses(formId, { ...params, offset: MAX_PAGE_SIZE * idx })
        )
    )
  ).reduce(
    (arr: QuestionResponse[], { responses }) => [...arr, ...responses],
    []
  );
};

const isMatch = (response: QuestionResponse, filter: FilterClauseType) => {
  return !!response.questions.find(({ id, type, value }) => {
    if (filter.id != id) return false;
    switch (filter.condition) {
        case FilterCondition.EQUALS:
            return type === InputType.DATE_PICKER &&
            /^\d{4}-\d{2}-\d{2}$/.test(value as string)
            ? new Date(filter.value).setHours(0, 0, 0, 0) === new Date(value).getTime()
            : value == filter.value;
        case FilterCondition.GREATER_THAN:
            return filter.value < value;
        case FilterCondition.LESS_THAN:
            return filter.value > value;
        case FilterCondition.DOES_NOT_EQUAL:
            return value != filter.value;
        default:
            throw new Error(UNRECOGNIZED_FILTER_CONDITION);
    }
  });
};

export const filterResponsesWithCustomParams = (
  responses: QuestionResponse[],
  filters: ResponseFiltersType
) => {
  return filters.reduce(
    (arrResponses: QuestionResponse[], filter) =>
      arrResponses.filter((response) => isMatch(response, filter)),
    responses
  );
};