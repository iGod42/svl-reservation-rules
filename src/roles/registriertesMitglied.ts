import {generalRules, standardUserRules, redGreen} from "./knownCombos"
import {userIsInIt} from "../rules"

export const RM = {
	id: "R",
	key: "RM",
	name: "Registriertes Mitglied",
	reservationCreationRules: [
		...generalRules,
		...standardUserRules,
		...redGreen
	],
	reservationCancellationRules: [
		userIsInIt
	]
}