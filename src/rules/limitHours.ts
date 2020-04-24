import { LimitHoursDefinition } from "api/LimitHoursDefinition"
import { RuleEvaluation, RuleParser } from "api/Rule"
import { RuleDefinition } from "api"

const limitHours = ({
	startHour,
	endHour
}: LimitHoursDefinition): RuleEvaluation => ({ reservation }) => {
	const date = reservation.hour
	if (
		date.getHours() <= startHour ||
		date.getHours() > endHour ||
		date.getMinutes() !== 0 ||
		date.getSeconds() !== 0 ||
		date.getMilliseconds() !== 0
	)
		return `Eintragen nur zwischen ${startHour}:00 und ${endHour}:00 Uhr zur vollen Stunde möglich`
}

const parse: RuleParser = (definition: RuleDefinition) => {
	if (definition.type === "limitHours") {
		return limitHours(definition as LimitHoursDefinition)
	}
}

export default parse
