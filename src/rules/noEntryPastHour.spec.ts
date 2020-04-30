import { addDays } from "../tools"
import noEntryPastHour from "./noEntryPastHour"
import minReservation from "./MinReservation"
import { Reservation } from "./api"

describe("no entry past hour", () => {
	const getReservation = (
		hour: number,
		date = new Date(2019, 10, 10)
	): { reservation: Reservation } => ({
		reservation: {
			...minReservation,
			hour: new Date(
				date.getFullYear(),
				date.getMonth(),
				date.getDate(),
				hour,
				0,
				0,
				0
			)
		}
	})
	describe("when not providing weekdays", () => {
		it("returns a message if the reservation is past or equal to the given hour", () => {
			const rule = noEntryPastHour({ type: "noEntryPastHour", hour: 17 })
			if (!rule) throw new Error("invalid definition")
			expect(typeof rule.evaluate(getReservation(18))).toBe("string")
		})
		it("returns falsely if the reservation is before the given hour", () => {
			const rule = noEntryPastHour({ type: "noEntryPastHour", hour: 16 })
			if (!rule) throw new Error("invalid definition")
			expect(rule.evaluate(getReservation(10))).toBeFalsy()
		})
	})

	describe("when providing weekdays", () => {
		const exampleMonday = new Date(2020, 0, 13)

		// after 17:00 only on mondays
		const rule = noEntryPastHour({
			type: "noEntryPastHour",
			hour: 17,
			weekDays: [1]
		})
		if (!rule) throw new Error("invalid definition")

		it("applies cutoff for weekdays given", () => {
			expect(typeof rule.evaluate(getReservation(18, exampleMonday))).toBe(
				"string"
			)
		})
		it("doesn't apply cutoff on weekdays not given", () => {
			expect(
				rule.evaluate(getReservation(18, addDays(exampleMonday, 1)))
			).toBeFalsy()
		})
	})
})
