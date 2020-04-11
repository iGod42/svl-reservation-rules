import { limitToCourts as srv } from "./limitToCourts"
import minReservation from "./MinReservation"

const getDate = (hour, minute = 0) => {
	const now = new Date()
	return new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		hour,
		minute,
		0,
		0
	)
}

describe("limit to courts rule", () => {
	describe("with only court constraint", () => {
		const theSrv = srv([1, 2])
		it("doesn't allow reservations for the first court in the list", () => {
			expect(
				typeof theSrv({
					...minReservation,
					courtId: 1,
					hour: new Date()
				})
			).toBe("string")
		})
		it("doesn't allow reservations for the second court in the list", () => {
			expect(
				typeof theSrv({
					...minReservation,
					courtId: 2,
					hour: new Date()
				})
			).toBe("string")
		})
		it("allows all courts that are not listed", () => {
			expect(
				theSrv({
					...minReservation,
					courtId: 3333,
					hour: new Date()
				})
			).toBeFalsy()
		})
	})

	describe("cutoff time is given", () => {
		const cutoffTime = 17
		const theSrv = srv([1], cutoffTime)

		it("rejects at exactly cutoff time ", () => {
			expect(
				typeof theSrv({
					...minReservation,
					courtId: 1,
					hour: getDate(cutoffTime)
				})
			).toBe("string")
		})
		it("rejects after cutoff time ", () => {
			expect(
				typeof theSrv({
					...minReservation,
					courtId: 1,
					hour: getDate(cutoffTime + 1)
				})
			).toBe("string")
		})
		it("accepts before cutoff time", () => {
			expect(
				theSrv({
					...minReservation,
					courtId: 1,
					hour: getDate(cutoffTime - 1)
				})
			).toBeFalsy()
		})
	})

	describe("when weekday is given", () => {
		const theSrv = srv([1], 0, [1])
		const exampleMonday = new Date(2020, 0, 13) // day 1
		const exampleTuesday = new Date(2020, 0, 14) // day 2
		it("accepts reservations on days not listed", () => {
			expect(
				theSrv({
					...minReservation,
					courtId: 1,
					hour: exampleTuesday
				})
			)
		})
		it("rejects reservations on days listed", () => {
			expect(
				theSrv({
					...minReservation,
					courtId: 1,
					hour: exampleMonday
				})
			)
		})
	})
})
