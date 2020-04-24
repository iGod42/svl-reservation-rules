import { Reservation, RuleDefinition } from "../api"

export interface RuleEvaluationOptions {
	reservation: Reservation
	allReservations?: Reservation[]
	userId?: string
}

export interface RuleParser {
	(rule: RuleDefinition): RuleEvaluation | undefined
}

export interface RuleEvaluation {
	(options: RuleEvaluationOptions): string | undefined
}
