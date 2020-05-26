import { Reservation } from "../api"

const ignoreIds = ["gast", "g", "X_Gast"]

export const findFirstMatchingUser = (
	reservation: Reservation,
	userIds: string[]
) => {
	//hack assuming last one is the one reserving
	const filterUids = userIds.slice(0, -1)
		.filter(uid => !ignoreIds.includes(uid))
		.concat(userIds.slice(-1))
	return filterUids.find(id => reservation.reservedBy.id === id) ||
		filterUids.find(id => reservation.players.find(player => player.id === id))
}

export const getFilterForSameUser = (bRes: Reservation) => (
	aRes: Reservation
): boolean =>
	!!findFirstMatchingUser(
		aRes,
		bRes.players.concat(bRes.reservedBy).map(p => p.id)
	)
