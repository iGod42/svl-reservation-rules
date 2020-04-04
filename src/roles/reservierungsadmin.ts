import {IRole} from "../api"
import {generalRules} from "./knownCombos"
import {noEntryAfterWeek, noEntryBefore} from "../rules"

export const RA: IRole = {
	id: "A",
	key: "RA",
	name: "Reservierungsadmin",
	reservationCreationRules: [
		...generalRules,
		noEntryAfterWeek(52),
		noEntryBefore(366)
	]
}