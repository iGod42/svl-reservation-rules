import limitHours from "./limitHours"
import limitToCourts from "./limitToCourts"
import maxPerRange from "./maxPerRange"
import noDoubleCourtReservations from "./noDoubleCourtReservations"
import noEntryAfterWeek from "./noEntryAfterWeek"
import { RuleParser } from "api"

export const parsers: { [key: string]: RuleParser } = {
	limitHours,
	limitToCourts,
	maxPerRange,
	noDoubleCourtReservations,
	noEntryAfterWeek
}
