import { maxPerRange } from "../../rules"
import { IRule } from "../../api"

export const redGreen: IRule[] = [
	maxPerRange(2, { startAtReservationDay: true }), // max 2 hours per day
	maxPerRange(2, { dayRange: 2, startAtHour: 17 }), // max 2 rote hourn nach 17:00
	maxPerRange(4, { dayRange: 2 }), // max 4 rote hourn,
	maxPerRange(4, { dayOffset: 2, dayRange: "EOW" }) // max 4 Blaue hourn
]
