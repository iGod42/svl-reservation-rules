import { IRule } from "../api"

export const userIsInIt: IRule = (reservation, _allReservations, user) =>
	!!user &&
	reservation.reservedBy !== user.id &&
	!reservation.players.find(player => player === user.id)
		? `Benutzer ${user.id} ist nicht in der Reservierung`
		: false
