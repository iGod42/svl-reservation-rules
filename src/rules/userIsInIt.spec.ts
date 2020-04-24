import userIsInIt from "./userIsInIt"
import minReservation from "./MinReservation"

describe("user is in it rule", () => {
	const userId = "dummyXYZ"
	const distinctiveOtherReservation = minReservation

	const srv = userIsInIt({ type: "userIsInIt" })
	if (!srv) throw new Error("invalid definition")

	it("fails if user is not in the reservation", () => {
		expect(
			typeof srv({ reservation: distinctiveOtherReservation, userId })
		).toBe("string")
	})
	it("works if user is the one who reserved", () => {
		expect(
			srv({
				reservation: {
					...distinctiveOtherReservation,
					reservedBy: { id: userId }
				},
				userId
			})
		).toBeFalsy()
	})
	it("works if user is players", () => {
		expect(
			srv({
				reservation: {
					...distinctiveOtherReservation,
					players: [{ id: userId }]
				},
				userId
			})
		).toBeFalsy()
	})
})
