import { IReservation } from "api"

const fieldComparisons = ["Reserviert_von", "Spieler1", "Spieler2"]
	.map((item, _index, all) => all.map(other => ({ item, other })))
	.flat()

export const getFilterForSameUser = (reservation: IReservation) => (
	aRes: IReservation
): boolean =>
	!!fieldComparisons.find(
		comp =>
			aRes[comp.item] === reservation[comp.other] &&
			aRes[comp.item] &&
			reservation[comp.other]
	)
