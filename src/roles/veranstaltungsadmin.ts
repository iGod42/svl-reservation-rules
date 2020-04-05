import { generalRules } from "./knownCombos"
import { noEntryAfterWeek } from "../rules"
import { IRole } from "../api"

export const VA: IRole = {
	id: "V",
	key: "VA",
	name: "Veranstaltungsadmin",
	reservationCreationRules: [...generalRules, noEntryAfterWeek(52)]
}
