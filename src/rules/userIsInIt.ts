import {IRule} from "../api"

const matchedFields = ["Reserviert_von", "Spieler1", "Spieler2"]

export const userIsInIt: IRule = (reservation, _allReservations, user) =>
	!!user && !matchedFields.some(mf => reservation[mf] === user.BenutzerID) ?
		`Benutzer ${user.BenutzerID} ist nicht in der reservierung`
		: false
