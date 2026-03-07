export type HttpResponse<T> = {
  total?: number;
  data: T;
};

export type Me = {
  name: string;
  email: string;
  phoneNumber: string;
};
