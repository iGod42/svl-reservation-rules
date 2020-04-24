import noEntryBefore from "./noEntryBefore"
import minReservation from "./MinReservation"
import { Reservation } from "../api"

describe("opening hours rule", () => {
	describe("for current hour (without param)", () => {
		const rule = noEntryBefore({ type: "noEntryBefore" })
		if (!rule) throw new Error("invalid definition")
		const theSrv = (reservation: Reservation) => rule({ reservation })

		it("returns a message if the reservation is within the current hour ", () => {
			expect(
				typeof theSrv({
					...minReservation,
					hour: new Date()
				})
			).toBe("string")
		})
		it("returns a message if the reservation is in the past", () => {
			expect(
				typeof theSrv({
					...minReservation,
					hour: new Date(2000, 0, 0)
				})
			).toBe("string")
		})
		it("returns falsely if res is past the current hour", () => {
			const now = new Date()
			expect(
				theSrv({
					...minReservation,
					hour: new Date(
						now.getFullYear(),
						now.getMonth(),
						now.getDate(),
						now.getHours() + 1,
						0,
						0,
						0
					)
				})
			).toBeFalsy()
		})
	})
	describe("for allowing into the past (with param)", () => {
		const testOffset = 52 * 7
		const rule = noEntryBefore({ type: "noEntryBefore", dayOffset: testOffset })
		if (!rule) throw new Error("invalid definition")
		const theSrv = (reservation: Reservation) => rule({ reservation })

		it("returns falsely if res is past the current hour", () => {
			const now = new Date()
			expect(
				theSrv({
					...minReservation,
					hour: new Date(
						now.getFullYear(),
						now.getMonth(),
						now.getDate(),
						now.getHours() + 1,
						0,
						0,
						0
					)
				})
			).toBeFalsy()
		})
		it("returns falsely if res is past the offset date", () => {
			const theDate = new Date()
			theDate.setDate(theDate.getDate() - testOffset + 2)
			expect(theSrv({ ...minReservation, hour: theDate })).toBeFalsy()
		})
		it("returns a message if the date is before the offset date", () => {
			const theDate = new Date()
			theDate.setDate(theDate.getDate() - testOffset - 1)
			expect(
				typeof theSrv({
					...minReservation,
					hour: theDate
				})
			).toBe("string")
		})
	})
})
