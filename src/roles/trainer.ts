import {generalRules} from "./knownCombos"
import {noEntryBefore, noEntryAfterWeek, limitToCourts, userIsInIt} from "../rules"
import {IRole} from "../api"

export const TR: IRole = {
	id: "T",
	key: "TR",
	name: "Trainer",
	reservationCreationRules: [
		...generalRules,
		noEntryBefore(), // no entries after current hour has started
		noEntryAfterWeek(1),
		limitToCourts([5], 17, [1, 2, 3, 4, 5]) // Mo-Fr nach 17: nur mehr platz 5
	],
	reservationCancellationRules: [
		userIsInIt
	]
}