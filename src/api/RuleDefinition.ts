import { LimitToCourtsDefinition } from "./LimitToCourtsDefinition"
import { LimitHoursDefinition } from "./LimitHoursDefinition"
import { MaxPerRangeDefinition } from "./MaxPerRangeDefinition"

export type RuleDefinition =
	| LimitToCourtsDefinition
	| LimitHoursDefinition
	| MaxPerRangeDefinition
