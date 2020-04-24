import { LimitToCourtsDefinition } from "./LimitToCourtsDefinition"
import { LimitHoursDefinition } from "./LimitHoursDefinition"
import { MaxPerRangeDefinition } from "./MaxPerRangeDefinition"
import { NoDoubleCourtReservationDefinition } from "./NoDoubleCourtReservationDefinition"

export type RuleDefinition =
	| LimitToCourtsDefinition
	| LimitHoursDefinition
	| MaxPerRangeDefinition
	| NoDoubleCourtReservationDefinition
