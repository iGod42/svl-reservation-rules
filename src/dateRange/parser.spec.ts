import parser from "./parser"

describe("date parser", () => {
	it("applies the offset for days", () => {
		const raw = parser({ reference: "raw", dayOffset: 1 })
		const aDate = new Date(2020, 1, 10)
		expect(raw(aDate).getDay()).toEqual(aDate.getDay() + 1)
	})
	it("handles negative offset", () => {
		const raw = parser({ reference: "raw", dayOffset: -1 })
		const aDate = new Date(2020, 1, 10)
		expect(raw(aDate).getDay()).toEqual(aDate.getDay() + -1)
	})
	describe("raw", () => {
		it("returns the same date value if no offset is given", () => {
			const raw = parser({ reference: "raw" })
			const aDate = new Date()
			expect(raw(aDate).getTime()).toEqual(aDate.getTime())
		})
		it("returns a different date instance", () => {
			const raw = parser({ reference: "raw" })
			const aDate = new Date()
			expect(raw(aDate)).not.toBe(aDate)
		})
		it("lets hour untouched even with offset", () => {
			const raw = parser({ reference: "raw", dayOffset: 10 })
			const aDate = new Date()
			expect(raw(aDate).getHours()).toEqual(aDate.getHours())
		})
	})
	describe("beginningOfWeek", () => {
		it("returns monday as beginning of week", () => {
			const bow = parser({ reference: "beginningOfWeek" })
			const friday = new Date(2020, 3, 24)
			expect(bow(friday)).toEqual(new Date(2020, 3, 20))
		})
	})
	describe("endOfWeek", () => {
		it("returns 1ms before start of next week week", () => {
			const bow = parser({ reference: "endOfWeek" })
			const friday = new Date(2020, 3, 24)
			expect(bow(friday)).toEqual(new Date(2020, 3, 26, 23, 59, 59, 999))
		})
	})
	describe("startOfDay", () => {
		it("trims time component", () => {
			const bow = parser({ reference: "startOfDay" })
			const friday = new Date(2020, 3, 24, 1, 2, 3, 4)
			expect(bow(friday)).toEqual(new Date(2020, 3, 24))
		})
	})
})
