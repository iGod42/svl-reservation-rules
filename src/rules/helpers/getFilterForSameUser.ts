import { IReservation } from "../../api"

export const getFilterForSameUser = (bRes: IReservation) => (
	aRes: IReservation
): boolean =>
	aRes.reservedBy === bRes.reservedBy ||
	!!aRes.players.find(
		aPlayer =>
			aPlayer === bRes.reservedBy ||
			!!bRes.players.find(bPlayer => aPlayer === bPlayer)
	) ||
	!!bRes.players.find(bPlayer => bPlayer === aRes.reservedBy)
