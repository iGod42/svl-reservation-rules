import { IReservation } from "../../api"

export const getFilterForSameUser = (bRes: IReservation) => (
	aRes: IReservation
): boolean =>
	aRes.reservedBy.id === bRes.reservedBy.id
	|| !!aRes.players.find(aPlayer =>
		(aPlayer.id === bRes.reservedBy.id
			|| !!bRes.players.find(bPlayer => aPlayer.id === bPlayer.id)))
	|| !!bRes.players.find(bPlayer => bPlayer.id === aRes.reservedBy.id)
