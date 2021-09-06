import { UserTableConfig } from "src/app/interfaces/user";

export const TABLE_CONFIG: Array<UserTableConfig> = [
  { key: 'id', value: 'ID', readonly: true, type: 'input'},
  { key: 'firstName', value: 'First Name', type: 'input'},
  { key: 'middleName', value: 'Middle Name', type: 'input'},
  { key: 'lastName', value: 'Last Name', type: 'input'},
  { key: 'email', value: 'Email', type: 'input'},
  { key: 'phoneNumber', value: 'Phone No.', type: 'input'},
  { key: 'roles', value: 'Roles', type: 'dropdown'}
];

export const BTN_TEXT = {
  load: 'Load Data',
  refresh: 'Refresh Data'
};