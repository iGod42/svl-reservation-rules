import { IRole } from "../api"
import { standardUserRules, generalRules, redGreen } from "./knownCombos"
import { noEntryPastHour, userIsInIt } from "../rules"

export const JU: IRole = {
	id: "J",
	key: "JU",
	name: "Jugend",
	reservationCreationRules: [
		...generalRules,
		...standardUserRules,
		noEntryPastHour(17, [1, 2, 3, 4, 5]),
		...redGreen
	],
	reservationCancellationRules: [userIsInIt]
}
