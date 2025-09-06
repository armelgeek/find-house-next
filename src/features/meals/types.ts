export interface Meal {
  id: string;
  name: string;
  type: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export type MealResponse = {
  data: Meal[];
};
