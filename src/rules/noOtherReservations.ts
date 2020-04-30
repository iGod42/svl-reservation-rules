import { RuleParser, RuleDefinition, Rule, RuleEvaluationOptions, BulkRuleEvaluationOptions, Reservation } from "./api"

class NoOtherReservations implements Rule {
	readonly performanceImpact: number = 10

	private message = () => "Die Stunde wurde bereits reserviert!"

	private filter = (allReservations: Reservation[]) => (hour: Date, courtId: number) =>
		allReservations.find(er =>
			er.hour.getTime() === hour.getTime() &&
			er.courtId === courtId)

	evaluate = ({ reservation, allReservations }: RuleEvaluationOptions) =>
		allReservations && this.filter(allReservations)(reservation.hour, reservation.courtId) ?
			this.message() : undefined

	evaluateBulk = ({ reservationsInfo, allReservations }: BulkRuleEvaluationOptions) => {
		const relevantResInfo = reservationsInfo.filter(ri => !ri.violation)
		allReservations?.forEach(res => {
			const theResInfo = relevantResInfo.find(ri => ri.hour.getTime() === res.hour.getTime() && ri.courtId === res.courtId)
			if (theResInfo)
				theResInfo.violation = this.message()
		})
	}
}

const parse: RuleParser = (definition: RuleDefinition) => {
	if (definition.type === "noOtherReservations") {
		return new NoOtherReservations
	}
}

export default parse
