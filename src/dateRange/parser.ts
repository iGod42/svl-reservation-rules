import { RelativeDateDefinition, RelativeDateCalculation } from "./api/"
import { trimTimeComponent, getBeginningOfWeek, addDays } from "../tools"

export default (
	definition: RelativeDateDefinition
): RelativeDateCalculation => refDate => {
	let workingDate
	switch (definition.reference) {
		case "raw":
			workingDate = new Date(refDate)
			break
		case "startOfDay":
			workingDate = trimTimeComponent(refDate)
			break
		case "beginningOfWeek":
			workingDate = getBeginningOfWeek(refDate)
			break
		case "endOfWeek":
		default:
			workingDate = new Date(
				addDays(getBeginningOfWeek(refDate), 7).getTime() - 1
			)
			break
	}
	return addDays(workingDate, definition.dayOffset || 0)
}
