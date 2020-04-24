import limitHours from "./limitHours"
import limitToCourts from "./limitToCourts"
import { RuleParser } from "api"

export const parsers: { [key: string]: RuleParser } = {
	limitHours,
	limitToCourts
}
