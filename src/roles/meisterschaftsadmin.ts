import {IRole} from '../api'
import {generalRules} from './knownCombos'
import {noEntryAfterWeek} from '../rules'

export const MS: IRole = {
	id: 'M',
	key: 'MS',
	name: 'Meisterschaftsadmin',
	reservationCreationRules: [
		...generalRules,
		noEntryAfterWeek(52)
	]
}