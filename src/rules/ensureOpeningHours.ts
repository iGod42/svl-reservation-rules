import { IRule } from "../api"

const MESSAGE =
	"Eintragen nur zwischen 07:00 und 20:00 Uhr zur vollen hour möglich"

export const ensureOpeningHours: IRule = reservation => {
	const date = reservation.hour
	if (
		date.getHours() > 7 &&
		date.getHours() < 21 &&
		date.getMinutes() === 0 &&
		date.getSeconds() === 0 &&
		date.getMilliseconds() === 0
	)
		return false

	return MESSAGE
}
