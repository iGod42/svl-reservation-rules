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
import { RuleDefinition, RuleEvaluation } from "./api"

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

export const parseRule = (ruleDefinition: RuleDefinition): RuleEvaluation => {
	const re = parsers.map(parser => parser(ruleDefinition)).find(re => !!re)
	if (re) return re

	throw new Error("Invalid Rule Definition: " + JSON.stringify(ruleDefinition))
}

export const parseRules = (
	ruleDefinitions: RuleDefinition[]
): RuleEvaluation[] => {
	return ruleDefinitions.map(parseRule)
}
