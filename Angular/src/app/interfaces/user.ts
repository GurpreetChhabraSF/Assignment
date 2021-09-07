import { Roles } from "../enums/enums";

export interface User {
	id: number,
	firstName: string,
	middleName: string,
	lastName: string,
	email: string,
	phoneNumber: string,
	roles: Roles
};

export interface UserData {
	pagination: Pagination,
	data: Array<User>
};

export interface Pagination {
	totalPages: number,
	pageSize: number,
	pageNumber: number
};

export interface UserTableConfig {
	key: keyof User,
	value: string,
	readonly?: boolean,
	type?: string
}
