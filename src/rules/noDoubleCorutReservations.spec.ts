import noDoubleCourtReservations from "./noDoubleCourtReservations"
import minReservation from "./MinReservation"
import { Reservation } from "./api"

describe("no reservations on another court rule", () => {
	const basicDetails = {
		...minReservation,
		hour: new Date(2019, 10, 10)
	}

	const dummyReservation: Reservation = {
		...basicDetails,
		courtId: 1,
		reservedBy: { id: "rv" },
		players: [{ id: "s1" }, { id: "s2" }]
	}

	const rule = noDoubleCourtReservations({ type: "noDoubleCourtReservation" })
	if (!rule) throw new Error("invalid definition")

	const srv = (reservation: Reservation, allReservations: Reservation[]) =>
		rule({ reservation, allReservations })

	it("returns falsely if all other people are used", () => {
		expect(
			srv(dummyReservation, [
				{
					...basicDetails,
					courtId: 2,
					reservedBy: { id: "not_it" },
					players: [{ id: "also_not_it" }, { id: "not" }]
				}
			])
		).toBeFalsy()
	})

	it("returns falsely if the same details are used, but at another time", () => {
		expect(
			srv(dummyReservation, [
				{
					...dummyReservation,
					courtId: 2,
					hour: new Date(2019, 10, 10, 10, 0, 0, 0)
				}
			])
		).toBeFalsy()
	})

	// maybe add a test if getFilter for same user is used?
})
