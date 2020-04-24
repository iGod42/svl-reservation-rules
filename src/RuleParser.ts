import { parsers } from "./rules"

import { RuleDefinition, RuleEvaluation, RuleParser } from "./api"

export const parseRule = (ruleDefinition: RuleDefinition): RuleEvaluation => {
	Object.keys(parsers).forEach(parserKey => {
		const parser = parsers[parserKey] as RuleParser
		const ruleEvaluation = parser(ruleDefinition)
		return ruleEvaluation
	})
	throw new Error("Invalid Rule Definition: " + JSON.stringify(ruleDefinition))
}

export const parseRules = (
	ruleDefinitions: RuleDefinition[]
): RuleEvaluation[] => {
	return ruleDefinitions.map(parseRule)
}
