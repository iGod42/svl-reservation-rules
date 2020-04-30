import { Reservation } from "../api"

export const findFirstMatchingUser = (reservation: Reservation, userIds: string[]) =>
	userIds.find(id => reservation.reservedBy.id === id)
	|| userIds.find(id => reservation.players.find(player => player.id === id))

export const getFilterForSameUser = (bRes: Reservation) => (
		aRes: Reservation
	): boolean =>
	!! findFirstMatchingUser(aRes, bRes.players.concat(bRes.reservedBy).map(p => p.id))

