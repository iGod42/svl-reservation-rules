import {IRule} from "api/IRule"

export interface IRole {
	id: string,
	key: string,
	name: string,
	reservationCreationRules: IRule[],
	reservationCancellationRules?: IRule[]
}