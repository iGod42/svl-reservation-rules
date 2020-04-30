import { RuleDefinition, parseRules } from "../rules";
import { Rule, RuleEvaluationOptions, BulkRuleEvaluationOptions } from '../rules/api';

export class RuleEvaluator {
    private readonly rules: Rule[]
    constructor(rules: RuleDefinition[]) {
        this.rules = parseRules(rules).sort((a, b) => a.performanceImpact - b.performanceImpact)
    }

    evaluate = (options: RuleEvaluationOptions) => {
        for (let rule of this.rules) {
            const message = rule.evaluate(options)
            if (message)
                return message
        }
    }

    bulkEvaluate = (options: BulkRuleEvaluationOptions) => {
        this.rules.forEach(rule => rule.evaluateBulk(options))
    }
}