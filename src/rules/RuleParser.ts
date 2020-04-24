import { parsers } from "."
import { RuleDefinition, RuleEvaluation } from "../api"

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
