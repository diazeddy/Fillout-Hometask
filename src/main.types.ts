export enum FilterCondition {
	EQUALS = 'equals',
	DOES_NOT_EQUAL = 'does_not_equal',
	GREATER_THAN = 'greater_than',
	LESS_THAN = 'less_than'
}

export type FilterClauseType = {
	id: string;
	condition: FilterCondition;
	value: number | string;
}

export interface Question {
	id: string;
	name: string;
	type: string;
	value: string | number;
}

export interface QuestionResponse {
	submissionId: string;
	submissionTime: string;
	lastUpdatedAt: string;
	questions: Question[];
}

export interface FormbSubmissionResponse {
	responses: QuestionResponse[];
	totalResponses: number;
	pageCount: number;
}

export type ResponseFiltersType = FilterClauseType[];

export enum InputType {
	DATE_PICKER = 'DatePicker',
	NUMBER_INPUT = 'NumberInput',
	MULTIPLE_CHOICE = 'MultipleChoice',
	EMAIL_INPUT = 'EmailInput',
	SHORT_ANSWER = 'ShortAnswer',
	LONG_ANSWER = 'LongAnswer',
}