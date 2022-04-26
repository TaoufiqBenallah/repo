export interface Entry {
  readonly inArguments: any[];
  readonly outArguments: any[];
  readonly activityId: string;
  readonly journeyId: string;
  readonly activityObjectID: string;
  readonly definitionInstanceId: string;
  readonly activityInstanceId: string;
  readonly keyValue: string;
  readonly mode: number;
}
