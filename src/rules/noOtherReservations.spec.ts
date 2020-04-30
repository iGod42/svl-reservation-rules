import noOtherReservations from "./noOtherReservations"
import minReservation from "./MinReservation"
import { Reservation } from "./api"

describe("opening hours rule", () => {
	const reservation: Reservation = {
		...minReservation,
		hour: new Date(2019, 10, 10),
		courtId: 1
	}

	const srv = noOtherReservations({ type: "noOtherReservations" })?.evaluate
	if (!srv) throw new Error("Invalid definition")

	it("returns a message if there's a reservation at the same time and court", () => {
		expect(typeof srv({ reservation, allReservations: [reservation] })).toBe(
			"string"
		)
	})
	it("returns falsely if a reservation is defined at the same time but another court", () => {
		expect(
			srv({
				reservation,
				allReservations: [
					{
						...reservation,
						courtId: 3
					}
				]
			})
		).toBeFalsy()
	})
	it("returns falsely if a reservation is defined at the same court but another time", () => {
		expect(
			srv({
				reservation,
				allReservations: [
					{
						...reservation,
						hour: new Date(2019, 10, 10, 1, 0, 0, 0)
					}
				]
			})
		).toBeFalsy()
	})
	it("returns falsely if no other reservation is defined", () => {
		expect(srv({ reservation, allReservations: [] })).toBeFalsy()
	})
})
