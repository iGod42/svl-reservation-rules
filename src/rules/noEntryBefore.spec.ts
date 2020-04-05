import { noEntryBefore as srv } from "./noEntryBefore"
import minReservation from "./MinReservation"

describe("opening hours rule", () => {
	describe("for current hour (without param)", () => {
		const theSrv = srv()
		it("returns a message if the reservation is within the current hour ", () => {
			expect(
				typeof theSrv({
					...minReservation,
					Stunde: new Date()
				})
			).toBe("string")
		})
		it("returns a message if the reservation is in the past", () => {
			expect(
				typeof theSrv({
					...minReservation,
					Stunde: new Date(2000, 0, 0)
				})
			).toBe("string")
		})
		it("returns falsely if res is past the current hour", () => {
			const now = new Date()
			expect(
				theSrv({
					...minReservation,
					Stunde: new Date(
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
		const theSrv = srv(testOffset)
		it("returns falsely if res is past the current hour", () => {
			const now = new Date()
			expect(
				theSrv({
					...minReservation,
					Stunde: new Date(
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
			expect(theSrv({ ...minReservation, Stunde: theDate })).toBeFalsy()
		})
		it("returns a message if the date is before the offset date", () => {
			const theDate = new Date()
			theDate.setDate(theDate.getDate() - testOffset - 1)
			expect(
				typeof theSrv({
					...minReservation,
					Stunde: theDate
				})
			).toBe("string")
		})
	})
})
