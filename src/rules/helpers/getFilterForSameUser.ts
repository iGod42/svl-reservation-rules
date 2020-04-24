import { Reservation } from "../../api"

export const getFilterForSameUser = (bRes: Reservation) => (
	aRes: Reservation
): boolean =>
	aRes.reservedBy.id === bRes.reservedBy.id ||
	!!aRes.players.find(
		aPlayer =>
			aPlayer.id === bRes.reservedBy.id ||
			!!bRes.players.find(bPlayer => aPlayer.id === bPlayer.id)
	) ||
	!!bRes.players.find(bPlayer => bPlayer.id === aRes.reservedBy.id)
