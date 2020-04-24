import { Reservation } from "../api"
import { getFilterForSameUser as srv } from "./getFilterForSameUser"
import minReservation from "../MinReservation"

const basicDetails = {
	...minReservation,
	courtId: 1,
	hour: new Date(2019, 10, 10)
}
const dummyReservation: Reservation = {
	...basicDetails,
	reservedBy: { id: "rv" },
	players: [{ id: "as1" }, { id: "as2" }]
}

describe("getFilterForSameUser", () => {
	it("returns true if aReservedBy is bReserved by", () => {
		expect(
			srv(dummyReservation)({
				...basicDetails,
				reservedBy: dummyReservation.reservedBy
			})
		).toBeTruthy()
	})
	it("returns true if aReserved is in bPlayers", () => {
		expect(
			srv(dummyReservation)({
				...basicDetails,
				players: [dummyReservation.reservedBy]
			})
		).toBeTruthy()
	})
	it("returns true if an aPlayer is in bPlayers", () => {
		expect(
			srv(dummyReservation)({
				...basicDetails,
				players: [dummyReservation.players[0]]
			})
		).toBeTruthy()
	})
	it("returns false if there is no overlap", () => {
		expect(
			srv(dummyReservation)({
				...basicDetails
			})
		).toBeFalsy()
	})
})
