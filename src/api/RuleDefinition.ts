import { LimitToCourtsDefinition } from "./LimitToCourtsDefinition"
import { LimitHoursDefinition } from "./LimitHoursDefinition"
import { MaxPerRangeDefinition } from "./MaxPerRangeDefinition"
import { NoDoubleCourtReservationDefinition } from "./NoDoubleCourtReservationDefinition"
import { NoEntryAfterweekDefinition } from "./NoEntryAfterweekDefinition"
import { NoEntryBeforeDefinition } from "./NoEntryBeforeDefinition"
import { NoEntryPastHourDefinition } from "./NoEntryPastHourDefinition"

export type RuleDefinition =
	| LimitToCourtsDefinition
	| LimitHoursDefinition
	| MaxPerRangeDefinition
	| NoDoubleCourtReservationDefinition
	| NoEntryAfterweekDefinition
	| NoEntryBeforeDefinition
	| NoEntryPastHourDefinition
