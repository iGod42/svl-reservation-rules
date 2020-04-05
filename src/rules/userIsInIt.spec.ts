import { userIsInIt as srv } from "./userIsInIt"
import { IUser } from "../api"
import minReservation from "./MinReservation"

describe("user is in it rule", () => {
	const userName = "dummyXYZ"
	const theUser: IUser = { RolleID: "RM", BenutzerID: userName }
	const distinctiveOtherReservation = minReservation

	it("fails if user is not in the reservation", () => {
		expect(typeof srv(distinctiveOtherReservation, undefined, theUser)).toBe(
			"string"
		)
	})
	it("works if user is the one who reserved", () => {
		expect(
			srv(
				{
					...distinctiveOtherReservation,
					Reserviert_von: userName
				},
				undefined,
				theUser
			)
		).toBeFalsy()
	})
	it("works if user is player 1", () => {
		expect(
			srv(
				{
					...distinctiveOtherReservation,
					Spieler1: userName
				},
				undefined,
				theUser
			)
		).toBeFalsy()
	})
	it("works if user is palyer 2", () => {
		expect(
			srv(
				{
					...distinctiveOtherReservation,
					Spieler2: userName
				},
				undefined,
				theUser
			)
		).toBeFalsy()
	})
})
