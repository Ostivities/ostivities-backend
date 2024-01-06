export enum ACCOUNT_TYPE {
  PERSONAL = 'PERSONAL',
  ORGANISATION = 'ORGANISATION',
}

export interface IResponse {
  statusCode: string | any;
  message: string | any;
  data: any;
}
