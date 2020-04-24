import limitHours from "./limitHours"
import limitToCourts from "./limitToCourts"
import maxPerRange from "./maxPerRange"
import noDoubleCourtReservations from "./noDoubleCourtReservations"
import noEntryAfterWeek from "./noEntryAfterWeek"
import noEntryBefore from "./noEntryBefore"
import noEntryPastHour from "./noEntryPastHour"
import noOhterReservations from "./noOtherReservations"
import userIsInIt from "./userIsInIt"
import { RuleParser } from "./api"

export const parsers: RuleParser[] = [
	limitHours,
	limitToCourts,
	maxPerRange,
	noDoubleCourtReservations,
	noEntryAfterWeek,
	noEntryBefore,
	noEntryPastHour,
	noOhterReservations,
	userIsInIt
]

export { parseRule, parseRules } from "./RuleParser"

export { RuleDefinition } from "./api"
