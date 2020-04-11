import { userIsInIt as srv } from "./userIsInIt"
import { IUser } from "../api"
import minReservation from "./MinReservation"

describe("user is in it rule", () => {
	const userName = "dummyXYZ"
	const theUser: IUser = { roleId: "RM", id: userName }
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
					reservedBy: { id: userName, roleId: "R" }
				},
				undefined,
				theUser
			)
		).toBeFalsy()
	})
	it("works if user is players", () => {
		expect(
			srv(
				{
					...distinctiveOtherReservation,
					players: [{ id: userName }]
				},
				undefined,
				theUser
			)
		).toBeFalsy()
	})
})
