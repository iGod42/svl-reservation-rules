import formatWeekdays from "./formatWeekdays"

const options = {
	weekendText: "weekend",
	weekdayText: "weekday"
}

describe("format Weekdays", () => {
	it("returns weekdayText option if only weekdays are passed", () => {
		expect(formatWeekdays([1, 2, 3, 4, 5], options)).toEqual(
			options.weekdayText
		)
	})
	it("still weekdayText option when weekdays are in fucked up order", () => {
		expect(formatWeekdays([4, 5, 2, 1, 3], options)).toEqual(
			options.weekdayText
		)
	})
	it("returns weekdays comma separated if no weekdayText is passed", () => {
		expect(formatWeekdays([1, 2, 3, 4, 5]).split(",")).toHaveLength(5)
	})

	it("returns weekendText if only weekend days are passed", () => {
		const weekendText = "weekend"
		expect(formatWeekdays([0, 6], { weekendText })).toEqual(weekendText)
	})
	it("returns even when weekend days are in reverse up order", () => {
		const weekendText = "weekend"
		expect(formatWeekdays([6, 0], { weekendText })).toEqual(weekendText)
	})
	it("returns days comma separated if no weekendText is passed", () => {
		expect(formatWeekdays([0, 6]).split(",")).toHaveLength(2)
	})
	it("returns a separated list of weekdays if some are passed", () => {
		const days = [3, 6, 0]
		expect(formatWeekdays(days, options).split(",")).toHaveLength(days.length)
	})
	it("returns a separated list of weekdays if all are passed with no text options", () => {
		const days = [0, 1, 2, 3, 4, 5, 6]
		console.log(formatWeekdays(days))
		expect(formatWeekdays(days).split(",")).toHaveLength(days.length)
	})
	it("returns a separated list of weekdays if all are passed with text options", () => {
		const days = [0, 1, 2, 3, 4, 5, 6]
		console.log(formatWeekdays(days))
		expect(formatWeekdays(days, options).split(",")).toHaveLength(days.length)
	})
})
