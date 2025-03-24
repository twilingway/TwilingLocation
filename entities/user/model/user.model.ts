export interface IProfileUser {
  id: number;
  name: string;
  surname?: string;
  photo?: string;
}

export interface IUser {
  activity: null;
  balances: {
    default: number;
    referral: number;
  };
  profile: IProfileUser;
}
