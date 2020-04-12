import { noDoubleCortReservations as srv } from "./noDoubleCortReservations"
import minReservation from "./MinReservation"

describe("no reservations on another court rule", () => {
	const basicDetails = {
		...minReservation,
		hour: new Date(2019, 10, 10)
	}

	const dummyReservation = {
		...basicDetails,
		courtId: 1,
		reservedBy: "rv",
		players: ["s1", "s2"]
	}

	it("returns falsely if all other people are used", () => {
		expect(
			srv(dummyReservation, [
				{
					...basicDetails,
					courtId: 2,
					reservedBy: "not_it",
					players: ["also_not_it", "not"]
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
