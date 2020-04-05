import { IRole } from "api"
import { generalRules } from "./knownCombos"
import {
	noEntryPastHour,
	noEntryAfterWeek,
	noEntryBefore,
	userIsInIt
} from "../rules"

export const GA: IRole = {
	id: "G",
	key: "GA",
	name: "Gast",
	reservationCreationRules: [
		...generalRules,
		noEntryPastHour(17), // No entries after 17:00
		noEntryBefore(), // no entries after current hour has started
		noEntryAfterWeek(1) // max 1 week into the future
	],
	reservationCancellationRules: [userIsInIt]
}
