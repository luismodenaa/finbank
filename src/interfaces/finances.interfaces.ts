import Finances_categories from "../entities/finance_category.entity";
import { ICategoryRequest } from "./categories.interfaces";

export interface IFinanceRequest {
  description: string;
  value: number;
  isIncome: boolean;
  category: ICategoryRequest[];
  error?: {
    message: string;
  };
}

export interface IFinanceTransfRequest extends IFinanceRequest {
  isTransference: boolean;
}

export interface IFinanceResponse {
  id: string;
  description: string;
  value: number;
  isIncome: boolean;
  isTransference: boolean;
  createdAt: Date;
  financesCategory: Finances_categories[];
  error?: {
    message?: string;
  };
}

export interface IFinanceUpdate {
  description?: string;
  category?: ICategoryRequest[];
  error?: {
    message?: string;
  };
}

export type TFinanceCategoryWithoutFinance = Omit<Finances_categories, "finance">;

export interface IFinanceResponseArray {
  id: string;
  category: {
    id: string;
    name: string;
  };
}

export interface IFinanceUpdateResponse extends Omit<IFinanceResponse, "financesCategory"> {
  financesCategory: IFinanceResponseArray[];
}
