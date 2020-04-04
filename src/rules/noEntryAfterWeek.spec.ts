import {addDays, getBeginningOfWeek} from "../tools"
import {noEntryAfterWeek as srv} from "./noEntryAfterWeek"
import minReservation from "./MinReservation"

describe("no entry after week rule", () => {
	
	describe("called with no week offset", () => {
		const theSrv = srv()
		const testDate = (date) => theSrv({...minReservation, Stunde: date})
		
		it("rejects entries that are on the next Monday", () => {
			expect(typeof testDate(addDays(getBeginningOfWeek(new Date()), 7))).toBe("string")
		})
		it("accepts entries in the current calendar week", () => {
			expect(testDate(new Date())).toBeFalsy()
		})
		it("accepts entries in the past", () => {
			expect(testDate(addDays(new Date(), -100))).toBeFalsy()
		})
	})
	
	describe("called with week offset", () => {
		const weekOffset = 1
		const theSrv = srv(weekOffset)
		const testDate = (date) => theSrv({...minReservation, Stunde: date})
		
		it("rejects entries that are further away than Monday after the offset week", () => {
			expect(typeof testDate(addDays(getBeginningOfWeek(new Date()), 7 * (weekOffset + 1)))).toBe("string")
		})
		it("accepts entries that are before now", () => {
			expect(testDate(addDays(new Date(), -100))).toBeFalsy()
		})
		it("accepts entries that are between now and offset", () => {
			expect(testDate(addDays(new Date(), 5))).toBeFalsy()
		})
	})
})
