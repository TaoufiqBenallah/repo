export interface ErrorBus {
  state: boolean;
  errorCode?: any;
}

export const errorBus: ErrorBus = {state: false};
