import {addDays} from "../tools"
import {noEntryPastHour as srv} from "./noEntryPastHour"
import {IReservation} from "../api"
import minReservation from "./MinReservation"

describe("no entry past hour", () => {
	const getReservation = (hour: number, date = new Date(2019, 10, 10)): IReservation =>
		({...minReservation, Stunde: new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, 0, 0, 0)})
	describe("when not providing weekdays", () => {
		
		it("returns a message if the reservation is past or equal to the given hour", () => {
			expect(typeof srv(17)(getReservation(18))).toBe("string")
		})
		it("returns falsely if the reservation is before the given hour", () => {
			expect(srv(16)(getReservation(10))).toBeFalsy()
		})
	})
	
	describe("when providing weekdays", () => {
		const exampleMonday = new Date(2020, 0, 13)
		
		// after 17:00 only on mondays
		const theSrv = srv(17, [1])
		
		it("applies cutoff for weekdays given", () => {
			expect(typeof theSrv(getReservation(18, exampleMonday))).toBe("string")
		})
		it("doesn't apply cutoff on weekdays not given", () => {
			expect(theSrv(getReservation(18, addDays(exampleMonday, 1)))).toBeFalsy()
		})
	})
})
