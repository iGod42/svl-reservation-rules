import { IRule } from "../api"

const MESSAGE = "Die hour wurde bereits reserviert!"

export const noOtherReservations: IRule = (
	reservation,
	existingReservations
) => {
	if (!existingReservations)
		throw new Error("Existing reservation parameter is missing")

	return existingReservations.find(
		er =>
			er.hour.getTime() === reservation.hour.getTime() &&
			er.courtId === reservation.courtId
	)
		? MESSAGE
		: false
}
