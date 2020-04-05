import { ensureOpeningHours as srv } from "./ensureOpeningHours"
import minReservation from "./MinReservation"

describe("opening hours rule", () => {
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
	it("accepts times between 7:00 and 20:00", () => {
		expect(srv({ ...minReservation, Stunde: getDate(10) })).toBeFalsy()
	})
	it("rejects times between 7:00 and 20:00 that are not at 00:00", () => {
		expect(
			typeof srv({
				...minReservation,
				Stunde: getDate(10, 20)
			})
		).toBe("string")
	})
	it("rejects times before 7:00", () => {
		expect(
			typeof srv({
				...minReservation,
				Stunde: getDate(4)
			})
		).toBe("string")
	})
	it("rejects times after 20:00", () => {
		expect(
			typeof srv({
				...minReservation,
				Stunde: getDate(22)
			})
		).toBe("string")
	})
})
