export interface TableItemType {
  prop: string;
  label: string;
  width: number;
  image?: boolean;
  actions?: actionsItemType[];
  aligen?: string;
  formatter?: ItemFuncType;
  getType?: ItemFuncType;
}
interface ItemFuncType {
  (row: any): any;
}
interface actionsItemType {
  name: string;
  func: any;
  type?: any;
}
