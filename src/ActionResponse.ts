
export interface ActionResponse {
  success?: boolean;
  error?: boolean;

  message?: string;
  data?: any;

  redirect?: string;
  delay?: number;
}
