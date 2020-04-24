import { parseRule } from "./RuleParser"

describe("Rule Parser", () => {
	it("parses limitHours", () => {
		expect(
			typeof parseRule({ type: "limitHours", startHour: 7, endHour: 20 })
		).toBe("function")
	})
})
