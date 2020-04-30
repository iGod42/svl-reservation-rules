import limitHours from "./limitHours"
import minReservation from "./MinReservation"
import { Reservation } from "./api"

describe("limitHours", () => {
	describe("rule", () => {
		const startHour = 7
		const endHour = 20
		const rule = limitHours({
			type: "limitHours",
			startHour,
			endHour
		})
		if (!rule) return
		const srv = (reservation: Reservation) => rule.evaluate({ reservation })

		const getDate = (hour: number, minute = 0): Date => {
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
		it("accepts times between start and end", () => {
			expect(
				srv({
					...minReservation,
					hour: getDate(startHour + 1)
				})
			).toBeFalsy()
		})
		it("rejects times between start and end that are not at 0 minutes", () => {
			expect(
				typeof srv({
					...minReservation,
					hour: getDate(startHour + 1, 20)
				})
			).toBe("string")
		})
		it("accepts exactly startHour", () => {
			expect(srv({ ...minReservation, hour: getDate(startHour) })).toBeFalsy()
		})
		it("accepts exactly endHour", () => {
			expect(srv({ ...minReservation, hour: getDate(endHour) })).toBeFalsy()
		})
		it("rejects times before start", () => {
			expect(
				typeof srv({
					...minReservation,
					hour: getDate(startHour - 1)
				})
			).toBe("string")
		})
		it("rejects times after end", () => {
			expect(
				typeof srv({
					...minReservation,
					hour: getDate(endHour + 1)
				})
			).toBe("string")
		})
	})
})
