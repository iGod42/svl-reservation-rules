import { Reservation, RuleDefinition } from "."
import { ReservationInfo } from 'evaluation/ReservationInfo';

export interface RuleEvaluationOptions {
	reservation: Reservation
	allReservations?: Reservation[]
	userId?: string,
	now?: Date
}

export interface BulkRuleEvaluationOptions {
	reservationsInfo: ReservationInfo[],
	allReservations?: Reservation[],
	userId?: string,
	now?: Date
}

export interface RuleParser {
	(rule: RuleDefinition): Rule | undefined
}

export interface Rule {
	readonly performanceImpact: number

	evaluate(options: RuleEvaluationOptions): string | undefined

	evaluateBulk(options: BulkRuleEvaluationOptions): void
}