import {maxPerRange as srv} from "./maxPerRange"

import {addDays} from "../tools"

import minReservation from "./MinReservation"

const getDate = (hour, now = new Date()) => {
	return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0, 0, 0)
}

describe("max per range Rule", () => {
	const aMonday = new Date(2019, 9, 14)
	describe("startAtReservationDay -> to simply check the daily count", () => {
		const theSrv = srv(1, {limitForUser: false, startAtReservationDay: true})
		it("accepts any number > 0 if no reservations are passed", () => {
			expect(theSrv({...minReservation, Stunde: new Date(aMonday)}, [])).toBeFalsy()
		})
		it("works if reservation is not within that range", () => {
			expect(theSrv({...minReservation, Stunde: addDays(new Date(aMonday), 1)}, [{
				...minReservation,
				Stunde: new Date(aMonday)
			}])).toBeFalsy()
		})
		it("fails if there are more reservations than limit today", () => {
			expect(typeof theSrv({...minReservation, Stunde: new Date(aMonday)}, [{
				...minReservation,
				Stunde: new Date(aMonday)
			}])).toBe("string")
		})
		it("accepts ignores reservations that are yesterday", () => {
			expect(theSrv({...minReservation, Stunde: new Date(aMonday)}, [{
				...minReservation,
				Stunde: addDays(new Date(aMonday), -1)
			}])).toBeFalsy()
		})
		it("accepts ignores reservations that are tomorrow", () => {
			expect(theSrv({...minReservation, Stunde: new Date(aMonday)}, [{
				...minReservation,
				Stunde: addDays(new Date(aMonday), 1)
			}])).toBeFalsy()
		})
	})
	
	describe("red rule max two for two days", () => {
		const theSrv = srv(2, {dayRange: 2, limitForUser: false, today: aMonday})
		it("works if there are no reservations", () => {
			expect(theSrv({...minReservation, Stunde: new Date(aMonday)}, [])).toBeFalsy()
		})
		it("works if is one reservation today", () => {
			expect(theSrv({...minReservation, Stunde: new Date(aMonday)}, [{
				...minReservation,
				Stunde: new Date(aMonday)
			}])).toBeFalsy()
		})
		it("fails if there are two reservation today", () => {
			expect(typeof theSrv({...minReservation, Stunde: new Date(aMonday)}, [{
				...minReservation,
				Stunde: new Date(aMonday)
			}, {...minReservation, Stunde: new Date(aMonday)}])).toBe("string")
		})
		it("fails if there is a reservation today, and another tomorrow", () => {
			expect(typeof theSrv({...minReservation, Stunde: new Date(aMonday)}, [{
				...minReservation,
				Stunde: new Date(aMonday)
			}, {...minReservation, Stunde: addDays(new Date(aMonday), 1)}])).toBe("string")
		})
		it("ignores reservations after tomorrow", () => {
			expect(theSrv({...minReservation, Stunde: new Date(aMonday)}, [{
				...minReservation,
				Stunde: new Date(aMonday)
			}, {...minReservation, Stunde: addDays(new Date(aMonday), 2)}])).toBeFalsy()
		})
		it("ignores reservations before today", () => {
			expect(theSrv({...minReservation, Stunde: new Date(aMonday)}, [{
				...minReservation,
				Stunde: new Date(aMonday)
			}, {...minReservation, Stunde: addDays(new Date(aMonday), -1)}])).toBeFalsy()
		})
	})
	describe("red rule past 5", () => {
		const theSrv = srv(1, {dayRange: 2, startAtHour: 17, limitForUser: false, today: aMonday})
		it("works if there are no reservations", () => {
			expect(theSrv({...minReservation, Stunde: getDate(18, aMonday)}, [])).toBeFalsy()
		})
		it("works if there are reservations before the hour", () => {
			expect(theSrv({...minReservation, Stunde: getDate(18, aMonday)}, [{
				...minReservation,
				Stunde: getDate(14, aMonday)
			}])).toBeFalsy()
		})
		it("fails if there are reservations after the hour", () => {
			expect(typeof theSrv({...minReservation, Stunde: getDate(18, aMonday)}, [{
				...minReservation,
				Stunde: getDate(17, aMonday)
			}])).toBe("string")
		})
		it("works if there are reservations after the hour but outside of daterange", () => {
			expect(theSrv({...minReservation, Stunde: getDate(18, aMonday)}, [{
				...minReservation,
				Stunde: addDays(getDate(14, aMonday), 1)
			}])).toBeFalsy()
		})
		it("allows reservations tomorrow before 17:00 even if I have 2 at 17:00 today", () => {
			expect(theSrv({...minReservation, Stunde: addDays(getDate(13, aMonday), 1)}, [{
				...minReservation,
				Stunde: getDate(17, aMonday)
			}, {...minReservation, Stunde: getDate(18, aMonday)}])).toBeFalsy()
		})
	})
	
	describe("blueRule", () => {
		// today = monday
		const theSrv = srv(1, {dayOffset: 2, dayRange: "EOW", today: new Date(2019, 9, 14), limitForUser: false})
		it("fails if there is a reservation until the end of the week", () => {
			expect(typeof theSrv({...minReservation, Stunde: new Date(2019, 9, 16)}, [{
				...minReservation,
				Stunde: new Date(2019, 9, 17)
			}])).toBe("string")
		})
		it("works if there are only reservations before the offset", () => {
			expect(theSrv({...minReservation, Stunde: new Date(2019, 9, 16)}, [{
				...minReservation,
				Stunde: new Date(2019, 9, 15)
			}])).toBeFalsy()
		})
		it("works if there are only reservations after this week", () => {
			expect(theSrv({...minReservation, Stunde: new Date(2019, 9, 16)}, [{
				...minReservation,
				Stunde: new Date(2019, 9, 21)
			}]))
		})
		
		describe("user filter", () => {
			const theSrv = srv(1)
			const date = new Date()
			it("considers reservations where the same user is a part of", () => {
				expect(typeof theSrv({...minReservation, Stunde: date, Reserviert_von: "a"}, [{
					...minReservation,
					Stunde: date,
					Spieler1: "a"
				}])).toBe("string")
			})
			it("ignores reservations where none of the same users are present", () => {
				expect(theSrv({...minReservation, Stunde: date, Reserviert_von: "a", Spieler1: "b1", Spieler2: "b2"}, [{
					...minReservation,
					Stunde: date,
					Spieler1: "c1",
					Spieler2: "c2"
				}])).toBeFalsy()
			})
		})
	})
})