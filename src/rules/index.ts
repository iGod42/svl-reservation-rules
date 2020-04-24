import limitHours from "./limitHours"
import limitToCourts from "./limitToCourts"
import maxPerRange from "./maxPerRange"
import { RuleParser } from "api"

export const parsers: { [key: string]: RuleParser } = {
	limitHours,
	limitToCourts,
	maxPerRange
}
