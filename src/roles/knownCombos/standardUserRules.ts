import {
	noEntryBefore,
	noDoubleCortReservations,
	noEntryAfterWeek
} from "../../rules"
import { IRule } from "../../api"

export const standardUserRules: IRule[] = [
	noEntryBefore(), // no entries after current hour has started
	noDoubleCortReservations,
	noEntryAfterWeek(1) // max 1 week into the future
]
