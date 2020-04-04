import {IRule} from "../api"

const MESSAGE = "Die Stunde wurde bereits reserviert!"

export const noOtherReservations: IRule = (reservation, existingReservations) => {
	if (!existingReservations)
		throw new Error("Existing reservation parameter is missing")
	
	return existingReservations.find(er => er.Stunde.getTime() === reservation.Stunde.getTime() && er.PlatzID === reservation.PlatzID) ?
		MESSAGE :
		false
}